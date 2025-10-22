using talent360_backend.Dtos;
using talent360_backend.Helpers;
using talent360_backend.Models;
using talent360_backend.Proxies;
using talent360_backend.Repos.Interface;
using talent360_backend.Responses;
using talent360_backend.Services.Interface;

namespace talent360_backend.Services;

public class EmployeeService(
    IEmployeeRepo employeeRepo,
    ILogger<EmployeeService> logger,
    JwtHelper jwtHelper,
    MicroAdProxy microAdProxy) : IEmployeeService
{
    public async Task<ResultResponse<List<EmployeeModel>>> GetAllEmployees()
    {
        try
        {
            var allEmployees = await employeeRepo.GetAllEmployees();
            var result = new ResultResponse<List<EmployeeModel>>
            {
                Message = "GetAllEmployees Success",
                IsSuccess = true,
                Data = allEmployees
            };
            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "GetAllEmployees Failed");
            return new ResultResponse<List<EmployeeModel>> { IsSuccess = false, Message = ex.Message };
        }
    }

    public async Task<ResultResponse<string>> Login(string account, string password)
    {
        // var validInfo = await microAdProxy.CheckIsValidEmployee(account, password);
        var validInfo = new CheckIsValidEmployeeDto
        {
            IsValid = true,
            EmployeeNumber = "T0001",
            Email = "test@gmail.com",
        };
        if (!validInfo.IsValid)
        {
            return new ResultResponse<string> { IsSuccess = false, Message = "User Is Not Valid" };
        }

        var employee = await GetEmployeeByEmployeeNumberAndEmail(validInfo.EmployeeNumber, validInfo.Email);
        if (employee == null)
        {
            var employeeId = await InsertEmployeeAndGetId(validInfo.EmployeeNumber, validInfo.Email);
            employee = await GetEmployeeByEmployeeId(employeeId);
        }

        var token = jwtHelper.GenerateToken(employee);
        return new ResultResponse<string> { IsSuccess = true, Message = "Login Success", Data = token };
    }

    private async Task<EmployeeModel?> GetEmployeeByEmployeeNumberAndEmail(string employeeNumber, string email)
    {
        return await employeeRepo.GetEmployeeByEmployeeNumberAndEmail(employeeNumber, email);
    }

    private async Task<EmployeeModel?> GetEmployeeByEmployeeId(Guid employeeId)
    {
        return await employeeRepo.GetEmployeeByEmployeeId(employeeId);
    }

    private async Task<Guid> InsertEmployeeAndGetId(string employeeNumber, string email)
    {
        // var microAdEmployee = await microAdProxy.GetMicroAdEmployeeByEIdAndEmail(employeeNumber, email);
        var microAdEmployee = new MapMicroAdEmployeeDto
        {
            EmployeeNumber = "T0002",
            Name = "test2",
            FullName = "test2 test2",
            ChineseName = "測試2",
            Email = "test2@gmail.com",
            PhoneNumber = "0912345678",
            JobTitle = "Product Developer",
            JobGrade = "E3-9",
            ManageGrade = null,
            Location = "TP",
            Office = "TW",
            OnBoardDate = DateTime.Now,
        };
        if (microAdEmployee == null) return Guid.Empty;

        var insertEmployee = new EmployeeModel
        {
            EmployeeId = Guid.Empty,
            EmployeeNumber = microAdEmployee.EmployeeNumber,
            Name = microAdEmployee.Name,
            FullName = microAdEmployee.FullName,
            ChineseName = microAdEmployee.ChineseName,
            Email = microAdEmployee.Email,
            PhoneNumber = microAdEmployee.PhoneNumber,
            JobTitle = microAdEmployee.JobTitle,
            JobGrade = microAdEmployee.JobGrade,
            ManageGrade = microAdEmployee.ManageGrade,
            Location = microAdEmployee.Location,
            Office = microAdEmployee.Office,
            OrganizeId = 0,
            OnBoardDate = microAdEmployee.OnBoardDate,
            ConfirmDate = DateTime.Now,
        };

        var employeeId = await employeeRepo.InsertEmployee(insertEmployee);
        return employeeId;
    }
}