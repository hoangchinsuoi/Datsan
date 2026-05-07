namespace Datsan.Server.Core.DTOs;

public class ChatAskRequestDto
{
    public string Message { get; set; } = string.Empty;
    public Guid? ConversationId { get; set; }
    /// <summary>GUID phiên ẩn danh từ client; bắt buộc khi chưa đăng nhập.</summary>
    public string? ClientSessionId { get; set; }
}

public class ChatAskResponseDto
{
    public string Reply { get; set; } = string.Empty;
    public Guid ConversationId { get; set; }
}

public class ChatHistoryItemDto
{
    public string Role { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ChatHistoryResponseDto
{
    public List<ChatHistoryItemDto> Messages { get; set; } = new();
}

public class ChatConversationDto
{
    public Guid Id { get; set; }
    public int? UserId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string LastMessage { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
}

public class ChatAdminReplyDto
{
    public Guid ConversationId { get; set; }
    public string Message { get; set; } = string.Empty;
}
