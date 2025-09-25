using Microsoft.EntityFrameworkCore;
using talent360_backend.DBContexts;
using talent360_backend.Repos;
using talent360_backend.Repos.Interface;
using talent360_backend.Services;
using talent360_backend.Services.Interface;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("TalentDbContext");
builder.Services.AddDbContext<TalentDbContext>(options => options.UseSqlServer(connectionString));

//Service
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

//Repo
builder.Services.AddScoped<IEmployeeRepo, EmployeeRepo>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();