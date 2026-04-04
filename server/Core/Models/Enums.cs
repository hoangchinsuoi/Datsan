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
    Confirmed,
    Cancelled,
    Completed
}

public enum UserRole
{
    Guest,
    Member,
    Admin
}