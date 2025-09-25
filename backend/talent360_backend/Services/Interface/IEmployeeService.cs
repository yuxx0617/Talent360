using talent360_backend.Models;
using talent360_backend.Responses;

namespace talent360_backend.Services.Interface;

public interface IEmployeeService
{
    Task<ResultResponse<List<EmployeeModel>>> GetAllEmployees();
    Task<ResultResponse<string>> Login(string account, string password);
}