using System.Security.Claims;
using System.Text.RegularExpressions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;
using Datsan.Server.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Datsan.Server.Application.Services;

public class ChatService
{
    private static readonly Regex SuspiciousPromptPattern = new(
        @"(ignore\s+(all\s+)?(previous|above|prior)|disregard\s+(all\s+)?(previous|instructions)|system\s*prompt|reveal\s+(your\s+)?(instructions|prompt)|you\s+are\s+now\s+(a\s+)?|jailbreak|\bdan\s+mode\b)",
        RegexOptions.IgnoreCase | RegexOptions.CultureInvariant | RegexOptions.Compiled);

    private readonly AppDbContext _db;
    private readonly AiChatService _aiChat;
    private readonly IConfiguration _configuration;

    public ChatService(AppDbContext db, AiChatService aiChat, IConfiguration configuration)
    {
        _db = db;
        _aiChat = aiChat;
        _configuration = configuration;
    }

    public async Task<ChatAskResponseDto> AskAsync(ChatAskRequestDto dto, ClaimsPrincipal? user, CancellationToken cancellationToken)
    {
        var message = (dto.Message ?? string.Empty).Trim();
        if (string.IsNullOrEmpty(message))
        {
            throw new ArgumentException("Message không được để trống.");
        }

        var maxLen = _configuration.GetValue("Ai:MaxUserMessageLength", 2000);
        if (message.Length > maxLen)
        {
            throw new ArgumentException($"Tin nhắn quá dài (tối đa {maxLen} ký tự).");
        }

        if (SuspiciousPromptPattern.IsMatch(message))
        {
            throw new ArgumentException("Nội dung không được chấp nhận. Hãy đặt câu hỏi liên quan đặt sân hoặc tài khoản.");
        }

        var userId = TryGetUserId(user);
        var clientKey = NormalizeClientKey(dto.ClientSessionId);

        if (userId is null && string.IsNullOrEmpty(clientKey))
        {
            throw new ArgumentException("Thiếu ClientSessionId cho khách chưa đăng nhập.");
        }

        var conversation = await ResolveOrCreateConversationAsync(dto.ConversationId, userId, clientKey, cancellationToken);

        var maxHistory = _configuration.GetValue("Ai:MaxHistoryMessages", 24);
        var prior = await _db.ChatMessages
            .Where(m => m.ConversationId == conversation.Id)
            .OrderByDescending(m => m.CreatedAt)
            .Take(maxHistory)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new { m.Role, m.Content })
            .ToListAsync(cancellationToken);

        var history = prior
            .Select(m => (role: m.Role, content: m.Content))
            .ToList();

        var reply = await _aiChat.AskWithHistoryAsync(history, message, cancellationToken);

        _db.ChatMessages.Add(new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Role = "user",
            Content = message,
            CreatedAt = DateTime.UtcNow,
        });
        _db.ChatMessages.Add(new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Role = "assistant",
            Content = reply,
            CreatedAt = DateTime.UtcNow,
        });
        await _db.SaveChangesAsync(cancellationToken);

        return new ChatAskResponseDto { Reply = reply, ConversationId = conversation.Id };
    }

    public async Task<ChatHistoryResponseDto?> GetHistoryAsync(Guid conversationId, string? clientSessionId, ClaimsPrincipal? user, CancellationToken cancellationToken)
    {
        var userId = TryGetUserId(user);
        var clientKey = NormalizeClientKey(clientSessionId);

        var conversation = await _db.ChatConversations.AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == conversationId, cancellationToken);
        if (conversation is null)
        {
            return null;
        }

        if (!CanAccessConversation(conversation, userId, clientKey))
        {
            return null;
        }

        var items = await _db.ChatMessages.AsNoTracking()
            .Where(m => m.ConversationId == conversationId)
            .OrderBy(m => m.CreatedAt)
            .Select(m => new ChatHistoryItemDto
            {
                Role = m.Role,
                Content = m.Content,
                CreatedAt = m.CreatedAt,
            })
            .ToListAsync(cancellationToken);

        return new ChatHistoryResponseDto { Messages = items };
    }

    public async Task<List<ChatConversationDto>> GetAllConversationsAsync(CancellationToken cancellationToken)
    {
        return await _db.ChatConversations
            .AsNoTracking()
            .Include(c => c.User)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new ChatConversationDto
            {
                Id = c.Id,
                UserId = c.UserId,
                UserName = c.User != null ? c.User.FullName : "Khách ẩn danh",
                CreatedAt = c.CreatedAt,
                LastMessage = _db.ChatMessages
                    .Where(m => m.ConversationId == c.Id)
                    .OrderByDescending(m => m.CreatedAt)
                    .Select(m => m.Content)
                    .FirstOrDefault() ?? ""
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<Guid> SendUserMessageAsync(string message, Guid? conversationId, int? userId, string? clientKey, CancellationToken cancellationToken)
    {
        var conversation = await ResolveOrCreateConversationAsync(conversationId, userId, clientKey, cancellationToken);
        
        _db.ChatMessages.Add(new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversation.Id,
            Role = "user",
            Content = message,
            CreatedAt = DateTime.UtcNow,
        });

        await _db.SaveChangesAsync(cancellationToken);
        return conversation.Id;
    }

    public async Task ReplyAsAdminAsync(Guid conversationId, string message, CancellationToken cancellationToken)
    {
        var conversation = await _db.ChatConversations.FindAsync(new object[] { conversationId }, cancellationToken);
        if (conversation == null) throw new Exception("Conversation not found");

        _db.ChatMessages.Add(new ChatMessage
        {
            Id = Guid.NewGuid(),
            ConversationId = conversationId,
            Role = "admin",
            Content = message,
            CreatedAt = DateTime.UtcNow,
        });

        await _db.SaveChangesAsync(cancellationToken);
    }

    private async Task<ChatConversation> ResolveOrCreateConversationAsync(
        Guid? conversationId,
        int? userId,
        string? clientKey,
        CancellationToken cancellationToken)
    {
        if (conversationId is null)
        {
            var created = new ChatConversation
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                AnonymousKey = userId is null ? clientKey : null,
                CreatedAt = DateTime.UtcNow,
            };
            _db.ChatConversations.Add(created);
            await _db.SaveChangesAsync(cancellationToken);
            return created;
        }

        var existing = await _db.ChatConversations
            .FirstOrDefaultAsync(c => c.Id == conversationId.Value, cancellationToken);
        if (existing is null)
        {
            throw new ArgumentException("Cuộc trò chuyện không tồn tại.");
        }

        if (!CanAccessConversation(existing, userId, clientKey))
        {
            throw new UnauthorizedAccessException("Không có quyền truy cập cuộc trò chuyện này.");
        }

        return existing;
    }

    private static bool CanAccessConversation(ChatConversation conv, int? userId, string? clientKey)
    {
        if (conv.UserId is int ownerId)
        {
            return userId == ownerId;
        }

        return !string.IsNullOrEmpty(conv.AnonymousKey)
               && !string.IsNullOrEmpty(clientKey)
               && string.Equals(conv.AnonymousKey, clientKey, StringComparison.Ordinal);
    }

    private static int? TryGetUserId(ClaimsPrincipal? user)
    {
        if (user?.Identity?.IsAuthenticated != true)
        {
            return null;
        }

        var raw = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(raw, out var id) ? id : null;
    }

    private static string? NormalizeClientKey(string? clientSessionId)
    {
        if (string.IsNullOrWhiteSpace(clientSessionId))
        {
            return null;
        }

        var t = clientSessionId.Trim();
        return t.Length > 64 ? t[..64] : t;
    }
}
