using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewsController(ReviewService reviewService) => _reviewService = reviewService;

    /// <summary>
    /// Lấy danh sách đánh giá của một sân
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] int fieldId, CancellationToken cancellationToken)
    {
        try
        {
            var reviews = await _reviewService.GetReviewsByFieldIdAsync(fieldId, cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách đánh giá thành công", reviews));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Tạo đánh giá mới (chỉ Member đã đăng nhập mới được)
    /// </summary>
    [Authorize(Roles = "Member,Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var review = await _reviewService.CreateReviewAsync(dto, userId, cancellationToken);
            return Ok(ApiResponse.Success("Đánh giá thành công", review));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Lấy tất cả review
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllReviewsAdmin(CancellationToken cancellationToken)
    {
        try
        {
            var reviews = await _reviewService.GetAllReviewsAsync(cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách đánh giá thành công", reviews));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Xóa review
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReviewAdmin(int id, CancellationToken cancellationToken)
    {
        try
        {
            var success = await _reviewService.DeleteReviewAsync(id, cancellationToken);
            if (success)
                return Ok(ApiResponse.Success("Xóa đánh giá thành công", null));

            return NotFound(ApiResponse.Fail("Không tìm thấy đánh giá", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
