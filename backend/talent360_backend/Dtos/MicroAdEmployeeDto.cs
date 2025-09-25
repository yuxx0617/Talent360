namespace talent360_backend.Dtos;

public class MicroAdEmployeeDto
{
    public required string E_ID { get; set; }
    public required string Name { get; set; } 
    public string? FullName { get; set; }
    public string? ChineseName { get; set; }
    public string? Division { get; set; }
    public string? Department { get; set; }
    public string? Team { get; set; }
    public string? JobTitle { get; set; }
    public string? JobGrade { get; set; }
    public string? ManagementRole { get; set; }
    public required string Email { get; set; }
    public string Location { get; set; } = string.Empty;
    public string Office { get; set; } = string.Empty;
    public string ContactPhone { get; set; } = string.Empty;
    public DateTime? OnBoardDate { get; set; }
    public bool WorkingStatus { get; set; } = true;
}