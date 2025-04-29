using static Gerenciamento_de_Tarefas.Application.DTOs;

namespace Gerenciamento_de_Tarefas.Application
{
    public interface ITaskService
    {
        Task<IEnumerable<TaskResponseDto>> GetAllAsync();
        Task<TaskResponseDto> GetByIdAsync(int id);
        Task<TaskResponseDto> CreateAsync(TaskCreateDto taskDto);
        Task UpdateTaskAsync(int id, TaskUpdateDto taskDto);
        Task DeleteAsync(int id);
    }
}
