using Datsan.Server.Helpers;
using Datsan.Server.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/categories")]
public class CategoriesController : ControllerBase
{
    private readonly AppDbContext _db;

    public CategoriesController(AppDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> GetAll(CancellationToken cancellationToken)
    {
        var list = await _db.Categories
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .Select(c => new { c.Id, c.Name, c.Description })
            .ToListAsync(cancellationToken);

        return Ok(ApiResponse.Success("Lấy danh mục thành công", list));
    }
}
