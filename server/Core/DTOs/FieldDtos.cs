namespace Datsan.Server.Core.DTOs;

public class FieldDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    public string? ImageUrl { get; set; }
    public string? Description { get; set; }
    public string Status { get; set; } = "Available";
    public int MaxPlayers { get; set; }
    public double AverageRating { get; set; }
    public int ReviewsCount { get; set; }
}

public class FieldCreateDto
{
    public string Name { get; set; } = string.Empty;
    public int CategoryId { get; set; }
    public string Location { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public int MaxPlayers { get; set; }
}

public class FieldUpdateDto : FieldCreateDto { }