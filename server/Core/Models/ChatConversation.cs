namespace Datsan.Server.Core.Models;

public class ChatConversation
{
    public Guid Id { get; set; }
    public int? UserId { get; set; }
    /// <summary>
    /// Khóa phiên ẩn danh từ client (GUID), bắt buộc khi UserId null.
    /// </summary>
    public string? AnonymousKey { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public User? User { get; set; }
    public ICollection<ChatMessage> Messages { get; set; } = new List<ChatMessage>();
}
