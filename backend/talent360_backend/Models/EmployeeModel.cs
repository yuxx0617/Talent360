using System.ComponentModel.DataAnnotations;

namespace talent360_backend.Models;

public class EmployeeModel
{
    [Key] public required Guid EmployeeId { get; set; }
    public required string EmployeeNumber { get; set; } = string.Empty;
    public required string Name { get; set; } = string.Empty;
    public string? FullName { get; set; }
    public string? ChineseName { get; set; }
    public required string Email { get; set; } = string.Empty;
    public required string PhoneNumber { get; set; } = string.Empty;
    public required string JobTitle { get; set; } = string.Empty;
    public required string JobGrade { get; set; } = string.Empty;
    public string? ManageGrade { get; set; }
    public required string Office { get; set; } = string.Empty;
    public required string Location { get; set; } = string.Empty;
    public required int OrganizeId { get; set; }
    public DateTime? OnBoardDate { get; set; }
    public DateTime? ConfirmDate { get; set; }
}