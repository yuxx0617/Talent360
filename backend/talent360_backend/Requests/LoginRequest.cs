namespace talent360_backend.Requests;

public class LoginRequest
{
    public required string Account { get; set; }
    public required string Password { get; set; }
}