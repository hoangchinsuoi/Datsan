using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Repositories;

public class FieldRepository : IFieldRepository
{
    private readonly AppDbContext _db;

    public FieldRepository(AppDbContext db) => _db = db;

    public void Add(Field field) => _db.Fields.Add(field);

    public Task<bool> FieldExistsAsync(int fieldId, CancellationToken cancellationToken = default) =>
        _db.Fields.AnyAsync(f => f.Id == fieldId, cancellationToken);

    public Task<bool> CategoryExistsAsync(int categoryId, CancellationToken cancellationToken = default) =>
        _db.Categories.AnyAsync(c => c.Id == categoryId, cancellationToken);

    public Task<Field?> GetByIdWithIncludesAsync(int id, CancellationToken cancellationToken = default) =>
        _db.Fields
            .Include(f => f.Category)
            .Include(f => f.Reviews)
            .AsNoTracking()
            .FirstOrDefaultAsync(f => f.Id == id, cancellationToken);

    public async Task<List<Field>> QueryFieldsAsync(
        string? search,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        FieldStatus? status,
        CancellationToken cancellationToken = default)
    {
        var q = _db.Fields
            .AsNoTracking()
            .Include(f => f.Category)
            .Include(f => f.Reviews)
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.Trim();
            q = q.Where(f => f.Name.Contains(s) || f.Location.Contains(s));
        }

        if (categoryId is > 0)
            q = q.Where(f => f.CategoryId == categoryId);

        if (minPrice is > 0)
            q = q.Where(f => f.PricePerHour >= minPrice);

        if (maxPrice is > 0)
            q = q.Where(f => f.PricePerHour <= maxPrice);

        if (status is { } st)
            q = q.Where(f => f.Status == st);

        return await q.ToListAsync(cancellationToken);
    }
}
