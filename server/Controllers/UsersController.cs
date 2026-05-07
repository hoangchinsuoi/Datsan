using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Admin: Lấy danh sách toàn bộ người dùng
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetAllUsers(CancellationToken cancellationToken)
    {
        try
        {
            var users = await _userService.GetAllUsersAsync(cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách người dùng thành công", users));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Khóa/Mở khóa tài khoản
    /// </summary>
    [HttpPut("{id}/toggle-status")]
    public async Task<IActionResult> ToggleStatus(int id, CancellationToken cancellationToken)
    {
        try
        {
            var success = await _userService.ToggleUserStatusAsync(id, cancellationToken);
            if (success)
                return Ok(ApiResponse.Success("Cập nhật trạng thái người dùng thành công", null));
            
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Thay đổi vai trò người dùng
    /// </summary>
    [HttpPut("{id}/role")]
    public async Task<IActionResult> ChangeRole(int id, [FromBody] string role, CancellationToken cancellationToken)
    {
        try
        {
            var success = await _userService.ChangeUserRoleAsync(id, role, cancellationToken);
            if (success)
                return Ok(ApiResponse.Success("Cập nhật vai trò người dùng thành công", null));
            
            return NotFound(ApiResponse.Fail("Không tìm thấy người dùng", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Mời quản trị viên mới
    /// </summary>
    [HttpPost("invite-admin")]
    public async Task<IActionResult> InviteAdmin([FromBody] RegisterDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var success = await _userService.InviteAdminAsync(dto, cancellationToken);
            if (success)
                return Ok(ApiResponse.Success("Tạo tài khoản quản trị viên thành công", null));
            
            return BadRequest(ApiResponse.Fail("Không thể tạo tài khoản quản trị viên", null));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
