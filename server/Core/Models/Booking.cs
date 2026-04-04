using System;

namespace Datsan.Server.Core.Models;

public class Booking
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int FieldId { get; set; }
    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal TotalPrice { get; set; }
    public BookingStatus Status { get; set; } = BookingStatus.Pending;
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public Field? Field { get; set; }
}