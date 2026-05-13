using Datsan.Server.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Field> Fields => Set<Field>();
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<Review> Reviews => Set<Review>();
    public DbSet<ChatConversation> ChatConversations => Set<ChatConversation>();
    public DbSet<ChatMessage> ChatMessages => Set<ChatMessage>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>(e =>
        {
            e.HasIndex(u => u.Username).IsUnique();
            e.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<Field>(e =>
        {
            e.Property(f => f.PricePerHour).HasPrecision(18, 2);
            e.Property(f => f.Position)
                .HasConversion<string>()
                .HasMaxLength(16)
                .HasDefaultValue(FieldPosition.Front);
            e.Property(f => f.Format)
                .HasConversion<string>()
                .HasMaxLength(16)
                .HasDefaultValue(PitchFormat.FiveSide);
        });

        modelBuilder.Entity<Booking>()
            .Property(b => b.TotalPrice)
            .HasPrecision(18, 2);

        modelBuilder.Entity<Booking>()
            .HasIndex(b => new { b.FieldId, b.BookingDate, b.StartTime, b.EndTime });

        modelBuilder.Entity<ChatConversation>(e =>
        {
            e.HasKey(c => c.Id);
            e.HasOne(c => c.User)
                .WithMany(u => u.ChatConversations)
                .HasForeignKey(c => c.UserId)
                .OnDelete(DeleteBehavior.SetNull);
            e.Property(c => c.AnonymousKey).HasMaxLength(64);
        });

        modelBuilder.Entity<ChatMessage>(e =>
        {
            e.HasKey(m => m.Id);
            e.Property(m => m.Role).HasMaxLength(32);
            e.Property(m => m.Content).HasMaxLength(8000);
            e.HasIndex(m => m.ConversationId);
            e.HasOne(m => m.Conversation)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ConversationId)
                .OnDelete(DeleteBehavior.Cascade);
        });
    }
}
