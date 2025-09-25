using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using talent360_backend.Models;
using talent360_backend.Requests;
using talent360_backend.Responses;
using talent360_backend.Services.Interface;

namespace talent360_backend.Controllers;

[ApiController]
[Route("[controller]")]
public class EmployeeController(IEmployeeService employeeService) : ControllerBase
{
    [HttpPost(Name = "Login")]
    public async Task<ActionResult<ResultResponse<string>>> Login(LoginRequest loginRequest)
    {
        var result = await employeeService.Login(loginRequest.Account, loginRequest.Password);
        return result.IsSuccess ? Ok(result) : BadRequest(result);
    }

    [HttpGet(Name = "GetAllEmployees")]
    public async Task<ActionResult<ResultResponse<List<EmployeeModel>>>> GetAllEmployees()
    {
        var result = await employeeService.GetAllEmployees();
        return result.IsSuccess ? Ok(result) : NotFound(result);
    }
}