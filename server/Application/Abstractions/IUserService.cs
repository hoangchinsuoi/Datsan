using Datsan.Server.Core.DTOs;

namespace Datsan.Server.Application.Abstractions;

public interface IUserService
{
    Task<IReadOnlyList<UserDetailDto>> GetAllUsersAsync(CancellationToken cancellationToken = default);
    Task<bool> ToggleUserStatusAsync(int userId, CancellationToken cancellationToken = default);
    Task<bool> ChangeUserRoleAsync(int userId, string newRole, CancellationToken cancellationToken = default);
}
