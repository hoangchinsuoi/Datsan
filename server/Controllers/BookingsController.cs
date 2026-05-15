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
    private readonly VnpayService _vnpayService;

    public BookingsController(BookingService bookingService, VnpayService vnpayService)
    {
        _bookingService = bookingService;
        _vnpayService = vnpayService;
    }
    
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

    [HttpPost("{id}/vnpay/create-url")]
    public async Task<IActionResult> CreateVnpayUrl(
        int id,
        [FromBody] VnpayCreatePaymentRequestDto? dto,
        CancellationToken cancellationToken)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var payment = await _vnpayService.CreatePaymentUrlAsync(
                id,
                userId,
                dto?.ClientIp ?? HttpContext.Connection.RemoteIpAddress?.ToString(),
                dto?.OrderInfo,
                cancellationToken);

            return Ok(ApiResponse.Success("Tạo URL thanh toán VNPay thành công.", payment));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    [AllowAnonymous]
    [HttpGet("vnpay-return")]
    public async Task<IActionResult> VnpayReturn(CancellationToken cancellationToken)
    {
        var result = await _vnpayService.HandleReturnAsync(Request.Query, cancellationToken);

        if (!string.IsNullOrWhiteSpace(result.RedirectUrl))
        {
            return Redirect(result.RedirectUrl);
        }

        if (result.Success)
        {
            return Ok(ApiResponse.Success(result.Message, result));
        }

        return BadRequest(ApiResponse.Fail(result.Message, result));
    }

    /// <summary>
    /// Admin: Lấy toàn bộ danh sách booking hệ thống
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> GetAllBookings(CancellationToken cancellationToken)
    {
        try
        {
            var bookings = await _bookingService.GetAdminBookingsAsync(cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách booking toàn hệ thống thành công", bookings));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Cập nhật trạng thái đơn đặt sân
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPut("{id}/status")]
    public async Task<IActionResult> UpdateBookingStatus(int id, [FromBody] string status, CancellationToken cancellationToken)
    {
        try
        {
            var success = await _bookingService.UpdateStatusAsync(id, status, cancellationToken);
            if (success)
                return Ok(ApiResponse.Success("Cập nhật trạng thái booking thành công", null));

            return BadRequest(ApiResponse.Fail("Không thể cập nhật trạng thái booking", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
