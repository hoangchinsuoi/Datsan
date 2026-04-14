using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IBookingRepository
{
    Task<Booking?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Booking?> GetByIdWithFieldAsync(int id, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Booking>> GetByUserIdWithFieldAsync(int userId, CancellationToken cancellationToken = default);
    Task<bool> HasOverlapAsync(
        int fieldId,
        DateOnly bookingDate,
        TimeOnly startTime,
        TimeOnly endTime,
        int? excludeBookingId,
        CancellationToken cancellationToken = default);
    Task<IReadOnlyList<Booking>> GetByFieldAndDateAsync(
        int fieldId,
        DateOnly bookingDate,
        CancellationToken cancellationToken = default);
    void Add(Booking booking);
}
