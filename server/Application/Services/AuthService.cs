using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;
using Datsan.Server.Helpers;

namespace Datsan.Server.Application.Services;

public class AuthService
{
    private readonly IUserRepository _users;
    private readonly IUnitOfWork _unitOfWork;
    private readonly JwtService _jwtService;

    public AuthService(IUserRepository users, IUnitOfWork unitOfWork, JwtService jwtService)
    {
        _users = users;
        _unitOfWork = unitOfWork;
        _jwtService = jwtService;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto, CancellationToken cancellationToken = default)
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
            Role = UserRole.Member,
            IsActive = true,
        };

        _users.Add(user);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return _jwtService.GenerateTokens(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto, CancellationToken cancellationToken = default)
    {
        var user = await _users.FindByUsernameOrEmailAsync(dto.UsernameOrEmail, cancellationToken);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedAccessException("Thông tin đăng nhập không chính xác.");

        if (!user.IsActive)
            throw new InvalidOperationException("Tài khoản đã bị khóa.");

        return _jwtService.GenerateTokens(user);
    }
}
