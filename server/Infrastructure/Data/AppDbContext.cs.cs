using Datsan.Server.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Field> Fields { get; set; }
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<Review> Reviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Index để kiểm tra trùng lịch nhanh
        modelBuilder.Entity<Booking>()
            .HasIndex(b => new { b.FieldId, b.BookingDate, b.StartTime, b.EndTime });
    }
}