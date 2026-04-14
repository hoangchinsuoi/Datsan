using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Services;

public class BookingService
{
    private readonly IBookingRepository _bookings;
    private readonly IFieldRepository _fields;
    private readonly IUnitOfWork _unitOfWork;

    public BookingService(IBookingRepository bookings, IFieldRepository fields, IUnitOfWork unitOfWork)
    {
        _bookings = bookings;
        _fields = fields;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<BookingDto>> GetMyBookingsAsync(int userId, CancellationToken cancellationToken = default)
    {
        var list = await _bookings.GetByUserIdWithFieldAsync(userId, cancellationToken);
        return list.Select(MapToDto).ToList();
    }

    public async Task<BookingDto> CreateBookingAsync(BookingCreateDto dto, int userId, CancellationToken cancellationToken = default)
    {
        var field = await _fields.GetByIdWithIncludesAsync(dto.FieldId, cancellationToken);
        if (field is null)
            throw new InvalidOperationException("Không tìm thấy sân.");

        if (field.Status is FieldStatus.Closed or FieldStatus.Maintenance)
            throw new InvalidOperationException("Sân hiện không nhận đặt.");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (dto.BookingDate < today)
            throw new InvalidOperationException("Không thể đặt sân cho ngày trong quá khứ.");

        if (dto.EndTime <= dto.StartTime)
            throw new InvalidOperationException("Khung giờ không hợp lệ.");

        var hours = (dto.EndTime - dto.StartTime).TotalHours;
        if (hours <= 0)
            throw new InvalidOperationException("Khung giờ không hợp lệ.");

        var overlap = await _bookings.HasOverlapAsync(
            dto.FieldId,
            dto.BookingDate,
            dto.StartTime,
            dto.EndTime,
            excludeBookingId: null,
            cancellationToken);

        if (overlap)
            throw new InvalidOperationException("Khung giờ này đã có người đặt.");

        var total = field.PricePerHour * (decimal)hours;

        var booking = new Booking
        {
            UserId = userId,
            FieldId = dto.FieldId,
            BookingDate = dto.BookingDate,
            StartTime = dto.StartTime,
            EndTime = dto.EndTime,
            TotalPrice = total,
            Status = BookingStatus.Pending,
            Note = dto.Note,
        };

        _bookings.Add(booking);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var row = await _bookings.GetByIdWithFieldAsync(booking.Id, cancellationToken);
        return MapToDto(row!);
    }

    public async Task<bool> CancelBookingAsync(int bookingId, int userId, CancellationToken cancellationToken = default)
    {
        var booking = await _bookings.GetByIdAsync(bookingId, cancellationToken);
        if (booking is null || booking.UserId != userId)
            return false;

        if (booking.Status is BookingStatus.Cancelled or BookingStatus.Completed)
            return false;

        if (booking.Status == BookingStatus.Confirmed || booking.Status == BookingStatus.Pending)
        {
            booking.Status = BookingStatus.Cancelled;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
            return true;
        }

        return false;
    }

    public async Task<IReadOnlyList<AvailableSlotDto>> GetAvailableSlotsAsync(
        int fieldId, 
        DateOnly date, 
        CancellationToken cancellationToken = default)
    {
        var field = await _fields.GetByIdWithIncludesAsync(fieldId, cancellationToken);
        if (field == null) return new List<AvailableSlotDto>();

        var existingBookings = await _bookings.GetByFieldAndDateAsync(fieldId, date, cancellationToken);
        
        var slots = new List<AvailableSlotDto>();
        // Hardcoded hours for now: 08:00 to 21:30
        var startTime = new TimeOnly(8, 0);
        var endTimeLimit = new TimeOnly(21, 30);
        
        var currentStart = startTime;
        var now = DateTime.Now;
        var today = DateOnly.FromDateTime(now);
        var currentTime = TimeOnly.FromDateTime(now);

        while (currentStart < endTimeLimit)
        {
            var currentEnd = currentStart.AddMinutes(90);
            
            // Check if this slot was already booked
            var isBooked = existingBookings.Any(b => 
                b.StartTime < currentEnd && b.EndTime > currentStart);
                
            // Check if slot is in the past
            var isPast = date < today || (date == today && currentStart < currentTime);
                
            slots.Add(new AvailableSlotDto
            {
                StartTime = currentStart,
                EndTime = currentEnd,
                IsAvailable = !isBooked && !isPast,
                Price = field.PricePerHour * 1.5m // 90 minutes
            });
            
            currentStart = currentEnd;
        }
        
        return slots;
    }

    private static BookingDto MapToDto(Booking b) =>
        new()
        {
            Id = b.Id,
            FieldId = b.FieldId,
            FieldName = b.Field?.Name ?? string.Empty,
            BookingDate = b.BookingDate,
            StartTime = b.StartTime,
            EndTime = b.EndTime,
            TotalPrice = b.TotalPrice,
            Status = b.Status.ToString(),
            Note = b.Note,
            CreatedAt = b.CreatedAt,
        };
}
