using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IFieldRepository
{
    Task<Field?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<Field?> GetByIdWithIncludesAsync(int id, CancellationToken cancellationToken = default);
    Task<List<Field>> QueryFieldsAsync(
        string? search,
        string? location,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        FieldStatus? status,
        FieldPosition? position,
        PitchFormat? format,
        CancellationToken cancellationToken = default);
    Task<bool> CategoryExistsAsync(int categoryId, CancellationToken cancellationToken = default);
    Task<bool> FieldExistsAsync(int fieldId, CancellationToken cancellationToken = default);
    void Add(Field field);
    void Update(Field field);
    void Remove(Field field);
}
