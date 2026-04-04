using System.Collections.Generic;

namespace Datsan.Server.Core.Models;

public class Field
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public FieldStatus Status { get; set; } = FieldStatus.Available;
    public int MaxPlayers { get; set; } = 10;

    public Category? Category { get; set; }
    public ICollection<Booking> Bookings { get; set; } = new List<Booking>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
}