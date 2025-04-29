using Gerenciamento_de_Tarefas.Application;
using Gerenciamento_de_Tarefas.Domain;

namespace Gerenciamento_de_Tarefas.Presentation.Extensions
{
    public static class ServiceExtensions
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<ITaskService, TaskService>();
            return services;
        }
    }
}
