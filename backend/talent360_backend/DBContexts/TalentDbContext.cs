using Microsoft.EntityFrameworkCore;
using talent360_backend.Models;

namespace talent360_backend.DBContexts;

public class TalentDbContext(DbContextOptions<TalentDbContext> options) : DbContext(options)
{
    public DbSet<EmployeeModel> Employee { get; set; }
}