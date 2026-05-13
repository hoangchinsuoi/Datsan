using Datsan.Server.Core.Models;

namespace Datsan.Server.Core.DTOs;

public class FieldDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string CategoryName { get; set; } = string.Empty;
    public string Location { get; set; } = string.Empty;
    public decimal PricePerHour { get; set; }
    public string? ImageUrl { get; set; }
    public List<string> GalleryImages { get; set; } = new();
    public string? Description { get; set; }
    public string Status { get; set; } = "Available";
    public string Position { get; set; } = "Front";
    public string Format { get; set; } = "FiveSide";
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
    /// <summary>Comma-separated list of gallery image URLs.</summary>
    public string? GalleryImages { get; set; }
    public string Position { get; set; } = "Front";
    public string Format { get; set; } = "FiveSide";
    public int MaxPlayers { get; set; }
}

public class FieldUpdateDto : FieldCreateDto { }