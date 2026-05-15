namespace Datsan.Server.Application.Abstractions;

public interface IAiChatBackend
{
    Task<string> AskWithHistoryAsync(
        IReadOnlyList<(string role, string content)> priorMessages,
        string newUserMessage,
        CancellationToken cancellationToken);
}
