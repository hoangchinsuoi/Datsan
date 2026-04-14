using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IReviewRepository
{
    Task<IReadOnlyList<Review>> GetByFieldIdWithUserAsync(int fieldId, CancellationToken cancellationToken = default);
    Task<Review?> GetByUserAndFieldAsync(int userId, int fieldId, CancellationToken cancellationToken = default);
    void Add(Review review);
}
