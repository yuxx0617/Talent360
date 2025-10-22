using Microsoft.EntityFrameworkCore;
using talent360_backend.DBContexts;
using talent360_backend.Helpers;
using talent360_backend.Proxies;
using talent360_backend.Repos;
using talent360_backend.Repos.Interface;
using talent360_backend.Services;
using talent360_backend.Services.Interface;

var builder = WebApplication.CreateBuilder(args);

const string specificOrigins = "_specificOrigins";

// 加入 CORS 服務
builder.Services.AddCors(options =>
{
    options.AddPolicy(name: specificOrigins,
        corsPolicyBuilder =>
        {
            corsPolicyBuilder.WithOrigins("http://localhost:9000")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddControllers();

var connectionString = builder.Configuration.GetConnectionString("TalentDbContext");
builder.Services.AddDbContext<TalentDbContext>(options => options.UseSqlServer(connectionString));

builder.Services.AddHttpClient<MicroAdProxy>();
builder.Services.AddScoped<JwtHelper>();

//Service
builder.Services.AddScoped<IEmployeeService, EmployeeService>();

//Repo
builder.Services.AddScoped<IEmployeeRepo, EmployeeRepo>();

var app = builder.Build();

app.UseRouting();
app.UseCors(specificOrigins);

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.MapControllers();

app.Run();