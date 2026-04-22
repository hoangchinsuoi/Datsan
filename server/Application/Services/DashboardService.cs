using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default)
    {
        var activeStatuses = new[] { BookingStatus.Confirmed, BookingStatus.Completed };

        var totalRevenue = await _db.Bookings
            .Where(b => activeStatuses.Contains(b.Status))
            .SumAsync(b => b.TotalPrice, cancellationToken);

        var totalBookings = await _db.Bookings.CountAsync(cancellationToken);
        var totalUsers = await _db.Users.CountAsync(cancellationToken);
        var activeFields = await _db.Fields.CountAsync(cancellationToken);

        // Chart data: Last 30 days
        var startDate = DateOnly.FromDateTime(DateTime.UtcNow.AddDays(-30));
        var revenueData = await _db.Bookings
            .Where(b => b.BookingDate >= startDate && activeStatuses.Contains(b.Status))
            .GroupBy(b => b.BookingDate)
            .OrderBy(g => g.Key)
            .Select(g => new RevenueChartItemDto
            {
                Date = g.Key.ToString("yyyy-MM-dd"),
                Revenue = g.Sum(b => b.TotalPrice)
            })
            .ToListAsync(cancellationToken);

        return new DashboardStatsDto
        {
            TotalRevenue = totalRevenue,
            TotalBookings = totalBookings,
            TotalUsers = totalUsers,
            ActiveFields = activeFields,
            RevenueItems = revenueData
        };
    }
}
