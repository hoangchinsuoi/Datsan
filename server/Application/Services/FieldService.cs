using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Services;

public class FieldService
{
    private readonly IFieldRepository _fields;
    private readonly IUnitOfWork _unitOfWork;

    public FieldService(IFieldRepository fields, IUnitOfWork unitOfWork)
    {
        _fields = fields;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<FieldDto>> GetAllAsync(
        string? search,
        int? categoryId,
        decimal? minPrice,
        decimal? maxPrice,
        string? status,
        CancellationToken cancellationToken = default)
    {
        FieldStatus? statusFilter = null;
        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<FieldStatus>(status, true, out var parsed))
            statusFilter = parsed;

        var list = await _fields.QueryFieldsAsync(search, categoryId, minPrice, maxPrice, statusFilter, cancellationToken);
        return list.Select(MapToDto).ToList();
    }

    public async Task<FieldDto?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        var field = await _fields.GetByIdWithIncludesAsync(id, cancellationToken);
        return field is null ? null : MapToDto(field);
    }

    public async Task<IReadOnlyList<FieldDto>> SearchAsync(string query, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(query))
            return Array.Empty<FieldDto>();

        var list = await _fields.QueryFieldsAsync(query.Trim(), null, null, null, null, cancellationToken);
        return list.Select(MapToDto).ToList();
    }

    public async Task<FieldDto> CreateAsync(FieldCreateDto dto, CancellationToken cancellationToken = default)
    {
        if (!await _fields.CategoryExistsAsync(dto.CategoryId, cancellationToken))
            throw new InvalidOperationException("Danh mục không tồn tại.");

        var field = new Field
        {
            Name = dto.Name,
            CategoryId = dto.CategoryId,
            Location = dto.Location,
            PricePerHour = dto.PricePerHour,
            Description = dto.Description,
            ImageUrl = dto.ImageUrl,
            MaxPlayers = dto.MaxPlayers,
            Status = FieldStatus.Available,
        };

        _fields.Add(field);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var created = await _fields.GetByIdWithIncludesAsync(field.Id, cancellationToken);
        return MapToDto(created!);
    }

    public async Task<FieldDto> UpdateAsync(int id, FieldUpdateDto dto, CancellationToken cancellationToken = default)
    {
        var field = await _fields.GetByIdAsync(id, cancellationToken);
        if (field is null)
            throw new InvalidOperationException("Không tìm thấy sân.");

        if (!await _fields.CategoryExistsAsync(dto.CategoryId, cancellationToken))
            throw new InvalidOperationException("Danh mục không tồn tại.");

        field.Name = dto.Name;
        field.CategoryId = dto.CategoryId;
        field.Location = dto.Location;
        field.PricePerHour = dto.PricePerHour;
        field.Description = dto.Description;
        field.ImageUrl = dto.ImageUrl;
        field.MaxPlayers = dto.MaxPlayers;

        _fields.Update(field);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var updated = await _fields.GetByIdWithIncludesAsync(field.Id, cancellationToken);
        return MapToDto(updated!);
    }

    public async Task DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        var field = await _fields.GetByIdAsync(id, cancellationToken);
        if (field is null)
            throw new InvalidOperationException("Không tìm thấy sân.");

        _fields.Remove(field);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
    }

    private static FieldDto MapToDto(Field f)
    {
        var avg = f.Reviews.Count == 0 ? 0 : f.Reviews.Average(r => (double)r.Rating);
        return new FieldDto
        {
            Id = f.Id,
            Name = f.Name,
            CategoryName = f.Category?.Name ?? string.Empty,
            Location = f.Location,
            PricePerHour = f.PricePerHour,
            ImageUrl = f.ImageUrl,
            Description = f.Description,
            Status = f.Status.ToString(),
            MaxPlayers = f.MaxPlayers,
            AverageRating = avg,
            ReviewsCount = f.Reviews.Count,
        };
    }
}
