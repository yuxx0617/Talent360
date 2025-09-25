using Microsoft.EntityFrameworkCore;
using talent360_backend.DBContexts;
using talent360_backend.Dtos;
using talent360_backend.Models;
using talent360_backend.Repos.Interface;

namespace talent360_backend.Repos;

public class EmployeeRepo(TalentDbContext talentDbContext, ILogger<EmployeeRepo> logger) : IEmployeeRepo
{
    public async Task<List<EmployeeModel>> GetAllEmployees()
    {
        try
        {
            return await talentDbContext.Employee.ToListAsync();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetAllEmployees Failed");
            throw;
        }
    }

    public async Task<EmployeeModel?> GetEmployeeByEmployeeNumberAndEmail(string employeeNumber, string email)
    {
        return await talentDbContext.Employee
            .SingleOrDefaultAsync(x => x.EmployeeNumber == employeeNumber & x.Email == email);
    }

    public async Task<EmployeeModel?> GetEmployeeByEmployeeId(Guid employeeId)
    {
        return await talentDbContext.Employee
            .SingleOrDefaultAsync(x => x.EmployeeId == employeeId);
    }

    public async Task<Guid> InsertEmployee(EmployeeModel employee)
    {
        await talentDbContext.Employee.AddAsync(employee);
        await talentDbContext.SaveChangesAsync();
        return employee.EmployeeId;
    }
}