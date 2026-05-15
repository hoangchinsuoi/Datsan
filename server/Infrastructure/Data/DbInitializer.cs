using Datsan.Server.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Data;

public static class DbInitializer
{
    public static async Task SeedAsync(AppDbContext db, CancellationToken cancellationToken = default)
    {
        if (await db.Users.AnyAsync(u => u.Username == "admin", cancellationToken))
            return;

        if (!await db.Categories.AnyAsync(cancellationToken))
        {
            db.Categories.AddRange(
                new Category { Name = "Bóng đá", Description = "Sân cỏ / sân 11 người" },
                new Category { Name = "Futsal", Description = "Sân trong nhà / 5 người" },
                new Category { Name = "Pickleball", Description = "Sân pickleball" });

            await db.SaveChangesAsync(cancellationToken);
        }

        var admin = new User
        {
            FullName = "Quản trị Datsan",
            Username = "admin",
            Email = "admin@datsan.local",
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin"),
            Role = UserRole.Admin,
            IsActive = true,
        };
        db.Users.Add(admin);
        await db.SaveChangesAsync(cancellationToken);

        var catFootball = await db.Categories.FirstAsync(c => c.Name == "Bóng đá", cancellationToken);
        var catFutsal = await db.Categories.FirstAsync(c => c.Name == "Futsal", cancellationToken);

        db.Fields.AddRange(
            new Field
            {
                Name = "Sân Central Park",
                CategoryId = catFootball.Id,
                Location = "Hà Nội",
                PricePerHour = 500_000,
                Description = "Mặt cỏ tự nhiên, đèn LED.",
                ImageUrl = null,
                Status = FieldStatus.Available,
                MaxPlayers = 22,
            },
            new Field
            {
                Name = "Futsal Arena 5",
                CategoryId = catFutsal.Id,
                Location = "TP.HCM",
                PricePerHour = 350_000,
                Description = "Sân futsal tiêu chuẩn.",
                ImageUrl = null,
                Status = FieldStatus.Available,
                MaxPlayers = 10,
            });

        await db.SaveChangesAsync(cancellationToken);
    }
}
