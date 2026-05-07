using System;

namespace Datsan.Server.Core.DTOs;

public class BookingCreateDto
{
    public int FieldId { get; set; }
    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public string? Note { get; set; }
}

public class BookingDto
{
    public int Id { get; set; }
    public int FieldId { get; set; }
    public string FieldName { get; set; } = string.Empty;
    public DateOnly BookingDate { get; set; }
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = "Pending";
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? UserName { get; set; }
}

public class AvailableSlotDto
{
    public TimeOnly StartTime { get; set; }
    public TimeOnly EndTime { get; set; }
    public bool IsAvailable { get; set; }
    public decimal Price { get; set; }
}

public class VnpayCreatePaymentRequestDto
{
    public string? ClientIp { get; set; }
    public string? OrderInfo { get; set; }
}

public class VnpayPaymentUrlDto
{
    public int BookingId { get; set; }
    public string TxnRef { get; set; } = string.Empty;
    public string PaymentUrl { get; set; } = string.Empty;
}

public class VnpayReturnResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public int? BookingId { get; set; }
    public string? TransactionNo { get; set; }
    public string? ResponseCode { get; set; }
    public string? RedirectUrl { get; set; }
}