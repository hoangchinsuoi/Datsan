using Datsan.Server.Core.Models;

namespace Datsan.Server.Application.Abstractions;

public interface IUserRepository
{
    Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default);
    Task<User?> FindByUsernameOrEmailAsync(string usernameOrEmail, CancellationToken cancellationToken = default);
    Task<bool> UsernameOrEmailTakenAsync(string username, string email, CancellationToken cancellationToken = default);
    Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default);
    void Add(User user);
    void Update(User user);
}
