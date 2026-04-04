using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly ReviewService _reviewService;

    public ReviewsController(ReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    /// <summary>
    /// Lấy danh sách đánh giá của một sân
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetReviews([FromQuery] int fieldId)
    {
        try
        {
            var reviews = await _reviewService.GetReviewsByFieldIdAsync(fieldId);

            return Ok(new
            {
                success = true,
                message = "Lấy danh sách đánh giá thành công",
                data = reviews
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    /// <summary>
    /// Tạo đánh giá mới (chỉ Member đã đăng nhập mới được)
    /// </summary>
    [Authorize(Roles = "Member")]
    [HttpPost]
    public async Task<IActionResult> CreateReview([FromBody] ReviewCreateDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var review = await _reviewService.CreateReviewAsync(dto, userId);

            return Ok(new
            {
                success = true,
                message = "Đánh giá thành công",
                data = review
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
    }
}