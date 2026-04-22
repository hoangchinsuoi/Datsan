using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Repositories;

public class ReviewRepository : IReviewRepository
{
    private readonly AppDbContext _db;

    public ReviewRepository(AppDbContext db) => _db = db;

    public void Add(Review review) => _db.Reviews.Add(review);

    public Task<Review?> GetByUserAndFieldAsync(int userId, int fieldId, CancellationToken cancellationToken = default) =>
        _db.Reviews.FirstOrDefaultAsync(r => r.UserId == userId && r.FieldId == fieldId, cancellationToken);

    public async Task<IReadOnlyList<Review>> GetByFieldIdWithUserAsync(int fieldId, CancellationToken cancellationToken = default)
    {
        var list = await _db.Reviews
            .AsNoTracking()
            .Include(r => r.User)
            .Where(r => r.FieldId == fieldId)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
        return list;
    }

    public async Task<IReadOnlyList<Review>> GetAllWithDetailsAsync(CancellationToken cancellationToken = default)
    {
        return await _db.Reviews
            .AsNoTracking()
            .Include(r => r.User)
            .Include(r => r.Field)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public Task<Review?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _db.Reviews.FirstOrDefaultAsync(r => r.Id == id, cancellationToken);

    public void Remove(Review review) => _db.Reviews.Remove(review);
}
