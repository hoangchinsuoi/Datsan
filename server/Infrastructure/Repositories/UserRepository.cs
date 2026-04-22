using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _db;

    public UserRepository(AppDbContext db) => _db = db;

    public void Add(User user) => _db.Users.Add(user);
    public void Update(User user) => _db.Users.Update(user);

    public Task<User?> GetByIdAsync(int id, CancellationToken cancellationToken = default) =>
        _db.Users.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);

    public Task<User?> FindByUsernameOrEmailAsync(string usernameOrEmail, CancellationToken cancellationToken = default) =>
        _db.Users.AsNoTracking().FirstOrDefaultAsync(
            u => u.Username == usernameOrEmail || u.Email == usernameOrEmail,
            cancellationToken);

    public Task<bool> UsernameOrEmailTakenAsync(string username, string email, CancellationToken cancellationToken = default) =>
        _db.Users.AnyAsync(u => u.Username == username || u.Email == email, cancellationToken);

    public async Task<IReadOnlyList<User>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await _db.Users.AsNoTracking().OrderByDescending(u => u.CreatedAt).ToListAsync(cancellationToken);
}
