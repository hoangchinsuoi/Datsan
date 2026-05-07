using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;

    public AuthController(AuthService authService) => _authService = authService;

    /// <summary>
    /// Đăng ký tài khoản mới
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.RegisterAsync(dto, cancellationToken);
            return Ok(ApiResponse.Success("Đăng ký thành công", result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Đăng nhập
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _authService.LoginAsync(dto, cancellationToken);
            return Ok(ApiResponse.Success("Đăng nhập thành công", result));
        }
        catch (Exception ex)
        {
            return Unauthorized(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Cập nhật thông tin cá nhân
    /// </summary>
    [HttpPut("profile")]
    [Microsoft.AspNetCore.Authorization.Authorize]
    public async Task<IActionResult> UpdateProfile([FromServices] Datsan.Server.Application.Abstractions.IUserService userService, [FromBody] UpdateProfileDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userIdString = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdString) || !int.TryParse(userIdString, out int userId))
                return Unauthorized(ApiResponse.Fail("Không thể xác thực người dùng", null));

            var result = await userService.UpdateProfileAsync(userId, dto, cancellationToken);
            if (result == null) return NotFound(ApiResponse.Fail("Không tìm thấy người dùng", null));

            return Ok(ApiResponse.Success("Cập nhật thông tin thành công", result));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
