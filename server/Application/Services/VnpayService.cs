using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using Datsan.Server.Application.Abstractions;
using Datsan.Server.Core.DTOs;
using Datsan.Server.Core.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Net;

namespace Datsan.Server.Application.Services;

public class VnpayService
{
    private readonly IConfiguration _configuration;
    private readonly IBookingRepository _bookings;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<VnpayService> _logger;

    public VnpayService(
        IConfiguration configuration,
        IBookingRepository bookings,
        IUnitOfWork unitOfWork,
        ILogger<VnpayService> logger)
    {
        _configuration = configuration;
        _bookings = bookings;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<VnpayPaymentUrlDto> CreatePaymentUrlAsync(
        int bookingId,
        int userId,
        string? clientIp,
        string? orderInfo,
        CancellationToken cancellationToken = default)
    {
        _logger.LogWarning("[VNPAY] Bắt đầu tạo URL thanh toán cho Booking ID: {BookingId}", bookingId);
        var booking = await _bookings.GetByIdAsync(bookingId, cancellationToken);
        if (booking is null || booking.UserId != userId)
        {
            throw new InvalidOperationException("Không tìm thấy booking cần thanh toán.");
        }

        if (booking.Status is BookingStatus.Cancelled or BookingStatus.Completed)
        {
            throw new InvalidOperationException("Booking hiện không thể thanh toán.");
        }

        if (booking.TotalPrice <= 0)
        {
            throw new InvalidOperationException("Số tiền thanh toán không hợp lệ.");
        }

        var tmnCode = GetRequiredConfig("Vnpay:TmnCode").Trim();
        var hashSecret = GetRequiredConfig("Vnpay:HashSecret").Trim();
        var paymentBaseUrl = GetRequiredConfig("Vnpay:PaymentUrl").Trim().TrimEnd('?');
        var returnUrl = GetRequiredConfig("Vnpay:ReturnUrl").Trim();

        var amount = decimal.ToInt64(decimal.Round(booking.TotalPrice * 100, 0, MidpointRounding.AwayFromZero));
        var txnRef = BuildTxnRef(booking.Id);
        var vnTime = DateTime.UtcNow.AddHours(7);
        var requestData = new SortedDictionary<string, string>(StringComparer.Ordinal)
        {
            ["vnp_Version"] = "2.1.0",
            ["vnp_Command"] = "pay",
            ["vnp_TmnCode"] = tmnCode,
            ["vnp_Amount"] = amount.ToString(CultureInfo.InvariantCulture),
            ["vnp_CreateDate"] = vnTime.ToString("yyyyMMddHHmmss"),
            ["vnp_CurrCode"] = "VND",
            ["vnp_IpAddr"] = NormalizeIp(clientIp),
            ["vnp_Locale"] = "vn",
            ["vnp_OrderInfo"] = BuildOrderInfo(booking.Id, orderInfo),
            ["vnp_OrderType"] = "200000",
            ["vnp_ReturnUrl"] = returnUrl,
            ["vnp_TxnRef"] = txnRef,
            ["vnp_SecureHashType"] = "HMACSHA512"
        };
        var bankCode = _configuration["Vnpay:BankCode"];
        if (!string.IsNullOrWhiteSpace(bankCode))
        {
            requestData["vnp_BankCode"] = bankCode.Trim();
        }

        var rawData = BuildRawQueryString(requestData);
        var secureHash = HmacSha512(hashSecret, rawData);
        var paymentUrl = $"{paymentBaseUrl}?{BuildEncodedQueryString(requestData)}&vnp_SecureHash={secureHash}";
        
        _logger.LogInformation("VNPAY URL Generated for Booking {BookingId}", booking.Id);

        return new VnpayPaymentUrlDto
        {
            BookingId = booking.Id,
            TxnRef = txnRef,
            PaymentUrl = paymentUrl
        };
    }

    public async Task<VnpayReturnResultDto> HandleReturnAsync(
        IQueryCollection query,
        CancellationToken cancellationToken = default)
    {
        var hashSecret = GetRequiredConfig("Vnpay:HashSecret").Trim();
        var frontendReturnUrl = _configuration["Vnpay:FrontendReturnUrl"]?.Trim();

        var queryPairs = query
            .Where(p => !string.IsNullOrWhiteSpace(p.Key))
            .ToDictionary(
                p => p.Key,
                p => p.Value.ToString(),
                StringComparer.Ordinal);

        var providedHash = queryPairs.GetValueOrDefault("vnp_SecureHash") ?? string.Empty;
        if (string.IsNullOrWhiteSpace(providedHash))
        {
            return BuildResult(
                ok: false,
                message: "Thiếu chữ ký VNPay.",
                bookingId: null,
                transactionNo: queryPairs.GetValueOrDefault("vnp_TransactionNo"),
                responseCode: queryPairs.GetValueOrDefault("vnp_ResponseCode"),
                frontendReturnUrl: frontendReturnUrl);
        }

        queryPairs.Remove("vnp_SecureHashType");
        queryPairs.Remove("vnp_SecureHash");
        var canonical = BuildRawQueryString(new SortedDictionary<string, string>(
            queryPairs.Where(p => !string.IsNullOrWhiteSpace(p.Value))
                .ToDictionary(p => p.Key, p => p.Value, StringComparer.Ordinal),
            StringComparer.Ordinal));

        var expectedHash = HmacSha512(hashSecret, canonical);
        if (!string.Equals(expectedHash, providedHash, StringComparison.OrdinalIgnoreCase))
        {
            return BuildResult(
                ok: false,
                message: "Sai chữ ký VNPay.",
                bookingId: null,
                transactionNo: queryPairs.GetValueOrDefault("vnp_TransactionNo"),
                responseCode: queryPairs.GetValueOrDefault("vnp_ResponseCode"),
                frontendReturnUrl: frontendReturnUrl);
        }

        var txnRef = queryPairs.GetValueOrDefault("vnp_TxnRef");
        var bookingId = ParseBookingIdFromTxnRef(txnRef);
        if (bookingId is null)
        {
            return BuildResult(
                ok: false,
                message: "Không xác định được booking từ giao dịch.",
                bookingId: null,
                transactionNo: queryPairs.GetValueOrDefault("vnp_TransactionNo"),
                responseCode: queryPairs.GetValueOrDefault("vnp_ResponseCode"),
                frontendReturnUrl: frontendReturnUrl);
        }

        var booking = await _bookings.GetByIdAsync(bookingId.Value, cancellationToken);
        if (booking is null)
        {
            return BuildResult(
                ok: false,
                message: "Booking không tồn tại.",
                bookingId: bookingId,
                transactionNo: queryPairs.GetValueOrDefault("vnp_TransactionNo"),
                responseCode: queryPairs.GetValueOrDefault("vnp_ResponseCode"),
                frontendReturnUrl: frontendReturnUrl);
        }

        var responseCode = queryPairs.GetValueOrDefault("vnp_ResponseCode");
        var transactionStatus = queryPairs.GetValueOrDefault("vnp_TransactionStatus");
        var success = string.Equals(responseCode, "00", StringComparison.Ordinal)
                      && string.Equals(transactionStatus, "00", StringComparison.Ordinal);

        if (success && booking.Status == BookingStatus.Pending)
        {
            booking.Status = BookingStatus.Paid;
            await _unitOfWork.SaveChangesAsync(cancellationToken);
        }

        var message = success
            ? "Thanh toán thành công."
            : $"Thanh toán không thành công (code: {responseCode ?? "unknown"}).";

        return BuildResult(
            ok: success,
            message: message,
            bookingId: booking.Id,
            transactionNo: queryPairs.GetValueOrDefault("vnp_TransactionNo"),
            responseCode: responseCode,
            frontendReturnUrl: frontendReturnUrl);
    }

    private static string BuildTxnRef(int bookingId) => $"{bookingId}-{DateTimeOffset.UtcNow.ToUnixTimeSeconds()}";

    private static int? ParseBookingIdFromTxnRef(string? txnRef)
    {
        if (string.IsNullOrWhiteSpace(txnRef))
        {
            return null;
        }

        var firstPart = txnRef.Split('-', 2, StringSplitOptions.RemoveEmptyEntries).FirstOrDefault();
        return int.TryParse(firstPart, out var id) ? id : null;
    }

    private static string BuildOrderInfo(int bookingId, string? orderInfo)
    {
        if (!string.IsNullOrWhiteSpace(orderInfo))
        {
            return orderInfo.Trim();
        }

        return $"ThanhToanDatSan{bookingId}";
    }

    private static string NormalizeIp(string? clientIp)
    {
        if (string.IsNullOrWhiteSpace(clientIp))
        {
            return "14.226.2.22"; // Fake VN IP for Sandbox
        }

        var raw = clientIp.Trim();
        if (raw == "::1")
        {
            return "127.0.0.1";
        }

        if (raw.StartsWith("::ffff:", StringComparison.OrdinalIgnoreCase))
        {
            return raw[7..];
        }

        return raw;
    }

    private static string BuildRawQueryString(IReadOnlyDictionary<string, string> data) =>
        string.Join("&", data
            .Where(p => !string.IsNullOrWhiteSpace(p.Value))
            .Select(p => $"{p.Key}={p.Value}"));

    private static string BuildEncodedQueryString(IReadOnlyDictionary<string, string> data) =>
        string.Join("&", data.Select(p => $"{WebUtility.UrlEncode(p.Key)}={WebUtility.UrlEncode(p.Value)}"));

    private static string HmacSha512(string key, string input)
    {
        var keyBytes = Encoding.UTF8.GetBytes(key);
        var inputBytes = Encoding.UTF8.GetBytes(input);
        using var hmac = new HMACSHA512(keyBytes);
        var hash = hmac.ComputeHash(inputBytes);
        return Convert.ToHexString(hash).ToUpperInvariant();
    }

    private string GetRequiredConfig(string key)
    {
        var value = _configuration[key];
        if (string.IsNullOrWhiteSpace(value))
        {
            throw new InvalidOperationException($"Thiếu cấu hình {key}.");
        }

        return value;
    }

    private static VnpayReturnResultDto BuildResult(
        bool ok,
        string message,
        int? bookingId,
        string? transactionNo,
        string? responseCode,
        string? frontendReturnUrl)
    {
        var result = new VnpayReturnResultDto
        {
            Success = ok,
            Message = message,
            BookingId = bookingId,
            TransactionNo = transactionNo,
            ResponseCode = responseCode
        };

        if (!string.IsNullOrWhiteSpace(frontendReturnUrl))
        {
            var separator = frontendReturnUrl.Contains('?', StringComparison.Ordinal) ? '&' : '?';
            result.RedirectUrl =
                $"{frontendReturnUrl}{separator}success={ok.ToString().ToLowerInvariant()}" +
                $"&bookingId={bookingId?.ToString() ?? string.Empty}" +
                $"&txn={Uri.EscapeDataString(transactionNo ?? string.Empty)}" +
                $"&code={Uri.EscapeDataString(responseCode ?? string.Empty)}";
        }

        return result;
    }
}
