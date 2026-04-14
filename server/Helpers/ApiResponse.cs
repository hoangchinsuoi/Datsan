namespace Datsan.Server.Helpers;

public static class ApiResponse
{
    public static object Success(string message, object? data = null) =>
        new { success = true, message, data };

    public static object Fail(string message, object? data = null) =>
        new { success = false, message, data };
}
