using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Services;

public class ReviewService
{
    private readonly IReviewRepository _reviews;
    private readonly IFieldRepository _fields;
    private readonly IUnitOfWork _unitOfWork;

    public ReviewService(IReviewRepository reviews, IFieldRepository fields, IUnitOfWork unitOfWork)
    {
        _reviews = reviews;
        _fields = fields;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<ReviewDto>> GetReviewsByFieldIdAsync(int fieldId, CancellationToken cancellationToken = default)
    {
        if (fieldId <= 0)
            throw new ArgumentException("fieldId không hợp lệ.", nameof(fieldId));

        if (!await _fields.FieldExistsAsync(fieldId, cancellationToken))
            throw new InvalidOperationException("Không tìm thấy sân.");

        var list = await _reviews.GetByFieldIdWithUserAsync(fieldId, cancellationToken);
        return list.Select(MapToDto).ToList();
    }

    public async Task<ReviewDto> CreateReviewAsync(ReviewCreateDto dto, int userId, CancellationToken cancellationToken = default)
    {
        if (dto.Rating is < 1 or > 5)
            throw new InvalidOperationException("Điểm đánh giá phải từ 1 đến 5.");

        if (!await _fields.FieldExistsAsync(dto.FieldId, cancellationToken))
            throw new InvalidOperationException("Không tìm thấy sân.");

        if (await _reviews.GetByUserAndFieldAsync(userId, dto.FieldId, cancellationToken) is not null)
            throw new InvalidOperationException("Bạn đã đánh giá sân này.");

        var review = new Review
        {
            UserId = userId,
            FieldId = dto.FieldId,
            Rating = dto.Rating,
            Comment = dto.Comment,
        };

        _reviews.Add(review);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var list = await _reviews.GetByFieldIdWithUserAsync(dto.FieldId, cancellationToken);
        var row = list.First(r => r.Id == review.Id);
        return MapToDto(row);
    }

    private static ReviewDto MapToDto(Review r) =>
        new()
        {
            Id = r.Id,
            UserFullName = r.User?.FullName ?? string.Empty,
            Rating = r.Rating,
            Comment = r.Comment,
            CreatedAt = r.CreatedAt,
        };
}
