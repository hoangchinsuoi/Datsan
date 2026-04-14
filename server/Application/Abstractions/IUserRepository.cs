using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IUserRepository
{
    Task<User?> FindByUsernameOrEmailAsync(string usernameOrEmail, CancellationToken cancellationToken = default);
    Task<bool> UsernameOrEmailTakenAsync(string username, string email, CancellationToken cancellationToken = default);
    void Add(User user);
}
