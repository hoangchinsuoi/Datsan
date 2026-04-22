using Datsan.Server.Core.DTOs;

namespace Datsan.Server.Application.Abstractions;

public interface IDashboardService
{
    Task<DashboardStatsDto> GetStatsAsync(CancellationToken cancellationToken = default);
}
