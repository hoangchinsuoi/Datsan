namespace Datsan.Server.Core.DTOs;

public class DashboardStatsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalBookings { get; set; }
    public int TotalUsers { get; set; }
    public int ActiveFields { get; set; }
    public List<RevenueChartItemDto> RevenueItems { get; set; } = new();
}

public class RevenueChartItemDto
{
    public string Date { get; set; } = string.Empty;
    public decimal Revenue { get; set; }
}
