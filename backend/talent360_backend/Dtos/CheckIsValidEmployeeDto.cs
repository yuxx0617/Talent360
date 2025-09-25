namespace talent360_backend.Dtos;

public class CheckIsValidEmployeeDto
{
    public required string EmployeeNumber { get; set; }
    public required string Email { get; set; }
    public required bool IsValid { get; set; }
}