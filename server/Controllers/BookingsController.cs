using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]   // Yêu cầu phải đăng nhập mới dùng được
public class BookingsController : ControllerBase
{
    private readonly BookingService _bookingService;

    public BookingsController(BookingService bookingService)
    {
        _bookingService = bookingService;
    }

    /// <summary>
    /// Lấy danh sách booking của người dùng hiện tại
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetMyBookings()
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var bookings = await _bookingService.GetMyBookingsAsync(userId);

            return Ok(new
            {
                success = true,
                message = "Lấy danh sách booking thành công",
                data = bookings
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
    /// Tạo booking mới
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> CreateBooking([FromBody] BookingCreateDto dto)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var booking = await _bookingService.CreateBookingAsync(dto, userId);

            return Ok(new
            {
                success = true,
                message = "Đặt sân thành công",
                data = booking
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
    /// Hủy booking
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelBooking(int id)
    {
        try
        {
            var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)!.Value);
            var success = await _bookingService.CancelBookingAsync(id, userId);

            if (success)
            {
                return Ok(new
                {
                    success = true,
                    message = "Hủy booking thành công"
                });
            }

            return BadRequest(new
            {
                success = false,
                message = "Không thể hủy booking"
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
