namespace talent360_backend.Dtos;

public class MicroAdIsValidDomainAccountDto
{
    public bool IsValid { get; set; } = false;
    public string e_ID { get; set; } = string.Empty;
    public string email { get; set; } = string.Empty;
}