using Microsoft.EntityFrameworkCore;
using Gerenciamento_de_Tarefas.Domain;

namespace Gerenciamento_de_Tarefas.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<TaskManager> Tasks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<TaskManager>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title)
                      .IsRequired()
                      .HasMaxLength(100);
                entity.Property(e => e.Description)
                      .HasMaxLength(500);
                entity.Property(e => e.CreationDate)
                      .HasDefaultValueSql("GETUTCDATE()");
                entity.Property(e => e.Status)
                      .HasConversion<string>()
                      .IsRequired();
            });
        }
    }
}