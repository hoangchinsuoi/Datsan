using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/fields")]
public class FieldsController : ControllerBase
{
    private readonly FieldService _fieldService;

    public FieldsController(FieldService fieldService) => _fieldService = fieldService;

    /// <summary>
    /// Lấy danh sách tất cả sân (có hỗ trợ filter, search)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetFields(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? status,
        CancellationToken cancellationToken)
    {
        try
        {
            var fields = await _fieldService.GetAllAsync(search, categoryId, minPrice, maxPrice, status, cancellationToken);
            return Ok(ApiResponse.Success("Lấy danh sách sân thành công", fields));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Lấy thông tin chi tiết một sân theo ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFieldById(int id, CancellationToken cancellationToken)
    {
        try
        {
            var field = await _fieldService.GetByIdAsync(id, cancellationToken);

            if (field is null)
                return NotFound(ApiResponse.Fail("Không tìm thấy sân", null));

            return Ok(ApiResponse.Success("Lấy thông tin sân thành công", field));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Tìm kiếm sân (dùng cho chức năng search)
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchFields([FromQuery] string query, CancellationToken cancellationToken)
    {
        try
        {
            var results = await _fieldService.SearchAsync(query, cancellationToken);
            return Ok(ApiResponse.Success("Tìm kiếm sân thành công", results));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }

    /// <summary>
    /// Admin: Tạo sân mới
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateField([FromBody] FieldCreateDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var field = await _fieldService.CreateAsync(dto, cancellationToken);
            return Ok(ApiResponse.Success("Tạo sân thành công", field));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message, null));
        }
    }
}
