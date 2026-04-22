using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Roles = "Admin")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    /// <summary>
    /// Admin: Lấy dữ liệu thống kê Dashboard
    /// </summary>
    [HttpGet("stats")]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        try
        {
            var stats = await _dashboardService.GetStatsAsync(cancellationToken);
            return Ok(ApiResponse.Success("Lấy thống kê thành công", stats));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
