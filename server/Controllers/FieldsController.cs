using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/fields")]
public class FieldsController : ControllerBase
{
    private readonly FieldService _fieldService;

    public FieldsController(FieldService fieldService)
    {
        _fieldService = fieldService;
    }

    /// <summary>
    /// Lấy danh sách tất cả sân (có hỗ trợ filter, search)
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetFields(
        [FromQuery] string? search,
        [FromQuery] int? categoryId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] string? status)
    {
        try
        {
            var fields = await _fieldService.GetAllAsync(search, categoryId, minPrice, maxPrice, status);

            return Ok(new
            {
                success = true,
                message = "Lấy danh sách sân thành công",
                data = fields
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
    /// Lấy thông tin chi tiết một sân theo ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<IActionResult> GetFieldById(int id)
    {
        try
        {
            var field = await _fieldService.GetByIdAsync(id);

            if (field == null)
                return NotFound(new { success = false, message = "Không tìm thấy sân" });

            return Ok(new
            {
                success = true,
                message = "Lấy thông tin sân thành công",
                data = field
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
    /// Tìm kiếm sân (dùng cho chức năng search)
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchFields([FromQuery] string query)
    {
        try
        {
            var results = await _fieldService.SearchAsync(query);

            return Ok(new
            {
                success = true,
                message = "Tìm kiếm sân thành công",
                data = results
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
    /// Admin: Tạo sân mới
    /// </summary>
    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> CreateField([FromBody] FieldCreateDto dto)
    {
        try
        {
            var field = await _fieldService.CreateAsync(dto);

            return Ok(new
            {
                success = true,
                message = "Tạo sân thành công",
                data = field
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