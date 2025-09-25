using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using talent360_backend.Models;

namespace talent360_backend.Helpers;

public class JwtHelper(string secretKey, string issuer, string audience)
{
    public string GenerateToken(EmployeeModel employee)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim("EmployeeId", employee.EmployeeId.ToString()),
            new Claim("EmployeeNumber", employee.EmployeeNumber),
            new Claim("EmployeeName", employee.Name),
            new Claim("EmployeeEmail", employee.Email)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}