using Gerenciamento_de_Tarefas.Application;
using Gerenciamento_de_Tarefas.Domain;
using Gerenciamento_de_Tarefas.Infrastructure.Data;
using Gerenciamento_de_Tarefas.Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Gerenciamento_de_Tarefas.Infrastructure.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddInfra(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<AppDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddScoped<ITaskRepository, TaskRepository>();
            services.AddScoped<ITaskService, TaskService>();

            return services;
        }
    }
}

