using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;

    public UserService(IUserRepository users, IUnitOfWork unitOfWork)
    {
        _users = users;
        _unitOfWork = unitOfWork;
    }

    public async Task<IReadOnlyList<UserDetailDto>> GetAllUsersAsync(CancellationToken cancellationToken = default)
    {
        var list = await _users.GetAllAsync(cancellationToken);
        return list.Select(u => new UserDetailDto
        {
            Id = u.Id,
            FullName = u.FullName,
            Username = u.Username,
            Email = u.Email,
            Role = u.Role.ToString(),
            Phone = u.Phone,
            IsActive = u.IsActive,
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task<bool> ToggleUserStatusAsync(int userId, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByIdAsync(userId, cancellationToken);
        if (user is null) return false;

        user.IsActive = !user.IsActive;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<bool> ChangeUserRoleAsync(int userId, string newRole, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByIdAsync(userId, cancellationToken);
        if (user is null) return false;

        if (!Enum.TryParse<UserRole>(newRole, true, out var parsedRole))
            return false;

        user.Role = parsedRole;
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }
    public async Task<bool> InviteAdminAsync(RegisterDto dto, CancellationToken cancellationToken = default)
    {
        if (await _users.UsernameOrEmailTakenAsync(dto.Username, dto.Email, cancellationToken))
            throw new InvalidOperationException("Username hoặc Email đã tồn tại.");

        var user = new User
        {
            FullName = dto.FullName,
            Username = dto.Username,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Phone = dto.Phone,
            Role = UserRole.Admin,
            IsActive = true,
        };

        _users.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<UserDetailDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _users.GetByIdAsync(userId, cancellationToken);
        if (user is null) return null;

        user.FullName = dto.FullName;
        user.Email = dto.Email;
        user.Phone = dto.Phone;
        user.AvatarUrl = dto.AvatarUrl;

        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new UserDetailDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Username = user.Username,
            Email = user.Email,
            Role = user.Role.ToString(),
            Phone = user.Phone,
            AvatarUrl = user.AvatarUrl,
            IsActive = user.IsActive,
            CreatedAt = user.CreatedAt
        };
    }
}
