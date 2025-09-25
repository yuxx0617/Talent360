using talent360_backend.Dtos;
using talent360_backend.Models;

namespace talent360_backend.Repos.Interface;

public interface IEmployeeRepo
{
    Task<List<EmployeeModel>> GetAllEmployees();
    Task<EmployeeModel?> GetEmployeeByEmployeeNumberAndEmail(string employeeNumber, string email);
    Task<EmployeeModel?> GetEmployeeByEmployeeId(Guid employeeId);

    Task<Guid> InsertEmployee(EmployeeModel employee);
}