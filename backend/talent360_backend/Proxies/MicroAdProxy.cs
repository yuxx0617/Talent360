using System.Text;
using Newtonsoft.Json;
using talent360_backend.Dtos;
using talent360_backend.Models;

namespace talent360_backend.Proxies;

public class MicroAdProxy(HttpClient httpClient, IConfiguration configuration)
{
    private readonly string? _baseUrl = configuration.GetValue<string>("MicroADConnection:BaseUrl");
    private readonly string? _key = configuration.GetValue<string>("MicroADConnection:Key");
    private readonly string? _keyValue = configuration.GetValue<string>("MicroADConnection:KeyValue");

    private void ConfigureHttpClient()
    {
        if (!string.IsNullOrEmpty(_baseUrl))
        {
            httpClient.BaseAddress = new Uri(_baseUrl);
        }

        if (!string.IsNullOrEmpty(_key) && !string.IsNullOrEmpty(_keyValue))
        {
            httpClient.DefaultRequestHeaders.Add(_key, _keyValue);
        }
    }

    public async Task<CheckIsValidEmployeeDto> CheckIsValidEmployee(string account, string password)
    {
        ConfigureHttpClient();
        var request = new HttpRequestMessage(HttpMethod.Post, "/api/Ad/IsValidDomainAccount");

        var requestBody = new
        {
            userName = account,
            password = password
        };

        request.Content = new StringContent(
            JsonConvert.SerializeObject(requestBody),
            Encoding.UTF8,
            "application/json"
        );
        var response = await httpClient.SendAsync(request);
        var microAdResponse = await response.Content.ReadFromJsonAsync<MicroAdIsValidDomainAccountDto>();
        if (response.IsSuccessStatusCode)
        {
            if (microAdResponse != null)
            {
                return new CheckIsValidEmployeeDto
                {
                    IsValid = microAdResponse.IsValid,
                    EmployeeNumber = microAdResponse.e_ID,
                    Email = microAdResponse.email
                };
            }
        }

        return new CheckIsValidEmployeeDto
        {
            IsValid = false,
            EmployeeNumber = "",
            Email = ""
        };
    }

    public async Task<MapMicroAdEmployeeDto?> GetMicroAdEmployeeByEIdAndEmail(string employeeNumber, string email)
    {
        ConfigureHttpClient();
        var request = new HttpRequestMessage(HttpMethod.Get,
            $"/api/Employee/GetEmployeeByEIdAndEmail?eid={employeeNumber}&email={email}");

        var response = await httpClient.SendAsync(request);
        var microAdResponse = await response.Content.ReadFromJsonAsync<MicroAdEmployeeDto>();
        if (!response.IsSuccessStatusCode) return null;
        if (microAdResponse != null)
        {
            return new MapMicroAdEmployeeDto
            {
                EmployeeNumber = microAdResponse.E_ID,
                Name = microAdResponse.Name,
                FullName = microAdResponse.FullName,
                ChineseName = microAdResponse.ChineseName,
                Email = microAdResponse.Email,
                PhoneNumber = microAdResponse.ContactPhone,
                JobTitle = microAdResponse.JobTitle ?? "",
                JobGrade = microAdResponse.JobGrade ?? "",
                ManageGrade = microAdResponse.ManagementRole,
                Office = microAdResponse.Office,
                Location = microAdResponse.Location,
                OnBoardDate = microAdResponse.OnBoardDate,
            };
        }

        return null;
    }
}