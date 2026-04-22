using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Repositories;

public class BookingRepository : IBookingRepository
{
    private readonly AppDbContext _db;

    public BookingRepository(AppDbContext db) => _db = db;

    public void Add(Booking booking) => _db.Bookings.Add(booking);

    public Task<Booking?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _db.Bookings.FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

    public Task<Booking?> GetByIdWithFieldAsync(int id, CancellationToken cancellationToken = default) =>
        _db.Bookings
            .AsNoTracking()
            .Include(b => b.Field)
            .FirstOrDefaultAsync(b => b.Id == id, cancellationToken);

    public async Task<IReadOnlyList<Booking>> GetByUserIdWithFieldAsync(int userId, CancellationToken cancellationToken = default)
    {
        var list = await _db.Bookings
            .AsNoTracking()
            .Include(b => b.Field)
            .Where(b => b.UserId == userId)
            .OrderByDescending(b => b.BookingDate)
            .ThenByDescending(b => b.StartTime)
            .ToListAsync(cancellationToken);
        return list;
    }

    public async Task<bool> HasOverlapAsync(
        int fieldId,
        DateOnly bookingDate,
        TimeOnly startTime,
        TimeOnly endTime,
        int? excludeBookingId,
        CancellationToken cancellationToken = default)
    {
        var active = new[] { BookingStatus.Pending, BookingStatus.Confirmed };

        var q = _db.Bookings.Where(b =>
            b.FieldId == fieldId
            && b.BookingDate == bookingDate
            && active.Contains(b.Status)
            && b.StartTime < endTime
            && b.EndTime > startTime);

        if (excludeBookingId is > 0)
            q = q.Where(b => b.Id != excludeBookingId);

        return await q.AnyAsync(cancellationToken);
    }
    
    public async Task<IReadOnlyList<Booking>> GetByFieldAndDateAsync(
        int fieldId, 
        DateOnly bookingDate, 
        CancellationToken cancellationToken = default)
    {
        var active = new[] { BookingStatus.Pending, BookingStatus.Confirmed };
        
        return await _db.Bookings
            .AsNoTracking()
            .Where(b => 
                b.FieldId == fieldId 
                && b.BookingDate == bookingDate
                && active.Contains(b.Status))
            .OrderBy(b => b.StartTime)
            .ToListAsync(cancellationToken);
    }

    public async Task<IReadOnlyList<Booking>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Bookings
            .AsNoTracking()
            .Include(b => b.Field)
            .Include(b => b.User)
            .OrderByDescending(b => b.CreatedAt)
            .ToListAsync(cancellationToken);
    }
}
