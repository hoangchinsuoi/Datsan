using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly BookingService _bookingService;

    public BookingsController(BookingService bookingService) => _bookingService = bookingService;
    
    [HttpGet("available-slots")]
    [AllowAnonymous]
    public async Task<IActionResult> GetAvailableSlots(
        [FromQuery] int fieldId, 
        [FromQuery] string date, 
        CancellationToken cancellationToken)
    {
        try
        {
            if (!DateOnly.TryParse(date, out var dateOnly))
                return BadRequest(ApiResponse.Fail("Định dạng ngày không hợp lệ. Sử dụng yyyy-MM-dd.", null));

            var slots = await _bookingService.GetAvailableSlotsAsync(fieldId, dateOnly, cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách khung giờ trống thành công", slots));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Lấy danh sách booking của người dùng hiện tại
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMyBookings(CancellationToken cancellationToken)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var bookings = await _bookingService.GetMyBookingsAsync(userId, cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách booking thành công", bookings));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var booking = await _bookingService.CreateBookingAsync(dto, userId, cancellationToken);
            return Ok(ApiResponse.Success("Đặt sân thành công", booking));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelBooking(int id, CancellationToken cancellationToken)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var success = await _bookingService.CancelBookingAsync(id, userId, cancellationToken);

            if (success)
                return Ok(ApiResponse.Success("Hủy booking thành công", null));

            return BadRequest(ApiResponse.Fail("Không thể hủy booking", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
