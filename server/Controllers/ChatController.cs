using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace Datsan.Server.Controllers;

[ApiController]
[Route("api/chat")]
public class ChatController : ControllerBase
{
    private readonly ChatService _chatService;

    public ChatController(ChatService chatService)
    {
        _chatService = chatService;
    }

    [HttpPost("ask")]
    public async Task<IActionResult> Ask([FromBody] ChatAskRequestDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var result = await _chatService.AskAsync(dto, User, cancellationToken);
            return Ok(ApiResponse.Success("AI trả lời thành công.", result));
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
        catch (UnauthorizedAccessException ex)
        {
            return StatusCode(StatusCodes.Status403Forbidden, ApiResponse.Fail(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse.Fail(ex.Message));
        }
    }

    /// <summary>
    /// Lấy lịch sử tin nhắn đã lưu. Khách ẩn danh cần gửi đúng clientSessionId đã tạo cuộc trò chuyện.
    /// </summary>
    [HttpGet("history")]
    public async Task<IActionResult> GetHistory(
        [FromQuery] Guid conversationId,
        [FromQuery] string? clientSessionId,
        CancellationToken cancellationToken)
    {
        var history = await _chatService.GetHistoryAsync(conversationId, clientSessionId, User, cancellationToken);
        if (history is null)
        {
            return NotFound(ApiResponse.Fail("Không tìm thấy cuộc trò chuyện hoặc không có quyền xem."));
        }

        return Ok(ApiResponse.Success("OK", history));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("conversations")]
    public async Task<IActionResult> GetConversations(CancellationToken cancellationToken)
    {
        var result = await _chatService.GetAllConversationsAsync(cancellationToken);
        return Ok(ApiResponse.Success("OK", result));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("admin-reply")]
    public async Task<IActionResult> ReplyAsAdmin([FromBody] ChatAdminReplyDto dto, CancellationToken cancellationToken)
    {
        await _chatService.ReplyAsAdminAsync(dto.ConversationId, dto.Message, cancellationToken);
        return Ok(ApiResponse.Success("Gửi phản hồi thành công.", null));
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ChatAskRequestDto dto, CancellationToken cancellationToken)
    {
        try
        {
            var userId = TryGetUserId();
            var clientKey = dto.ClientSessionId;
            var conversationId = await _chatService.SendUserMessageAsync(dto.Message, dto.ConversationId, userId, clientKey, cancellationToken);
            return Ok(ApiResponse.Success("Gửi tin nhắn thành công.", new { conversationId }));
        }
        catch (Exception ex)
        {
            return BadRequest(ApiResponse.Fail(ex.Message));
        }
    }

    private int? TryGetUserId()
    {
        if (User?.Identity?.IsAuthenticated != true) return null;
        var raw = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(raw, out var id) ? id : null;
    }
}
