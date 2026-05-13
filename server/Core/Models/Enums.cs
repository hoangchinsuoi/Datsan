namespace Datsan.Server.Core.Models;

public enum FieldStatus
{
    Available,
    Maintenance,
    Closed
}

public enum BookingStatus
{
    Pending,
    Paid,
    Confirmed,
    Cancelled,
    Completed
}

public enum UserRole
{
    Guest,
    Member,
    Admin,
    Owner
}

public enum FieldPosition
{
    Front, // Sân tiền
    Back   // Sân sâu
}

public enum PitchFormat
{
    FiveSide,   // Sân 5
    SevenSide,  // Sân 7
    ElevenSide  // Sân 11
}