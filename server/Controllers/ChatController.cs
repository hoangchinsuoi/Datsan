using Datsan.Server.Application.Services;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Helpers;
using Microsoft.AspNetCore.Mvc;

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
}
