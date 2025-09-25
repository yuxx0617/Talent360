namespace talent360_backend.Responses;

public class ResultResponse<T>
{
    public bool IsSuccess { get; set; }

    public string Message { get; set; } = string.Empty;

    public T? Data { get; set; }
}