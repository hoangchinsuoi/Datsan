using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IFieldRepository
{
    Task<Field?> GetByIdWithIncludesAsync(int id, CancellationToken cancellationToken = default);
    Task<List<Field>> QueryFieldsAsync(
        string? search,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        FieldStatus? status,
        CancellationToken cancellationToken = default);
    Task<bool> CategoryExistsAsync(int categoryId, CancellationToken cancellationToken = default);
    Task<bool> FieldExistsAsync(int fieldId, CancellationToken cancellationToken = default);
    void Add(Field field);
}
