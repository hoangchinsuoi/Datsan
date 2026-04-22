namespace Datsan.Server.Core.Models;

public class ChatMessage
{
    public Guid Id { get; set; }
    public Guid ConversationId { get; set; }
    /// <summary>user hoặc assistant</summary>
    public string Role { get; set; } = "user";
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ChatConversation Conversation { get; set; } = null!;
}
