using Gerenciamento_de_Tarefas.Domain;
using static Gerenciamento_de_Tarefas.Application.DTOs;

namespace Gerenciamento_de_Tarefas.Application
{
    public class TaskService : ITaskService
    {
        private readonly ITaskRepository _repository;

        public TaskService(ITaskRepository repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<TaskResponseDto>> GetAllAsync()
        {
            var tasks = await _repository.GetAllAsync();
            return tasks.Select(MapToDto);
        }

        public async Task<TaskResponseDto> GetByIdAsync(int id)
        {
            var task = await _repository.GetByIdAsync(id);
            return task != null ? MapToDto(task) : null;
        }

        public async Task<TaskResponseDto> CreateAsync(TaskCreateDto taskDto)
        {
            var task = new TaskManager
            {
                Title = taskDto.Title,
                Description = taskDto.Description,
                Status = taskDto.Status,
                CreationDate = DateTime.UtcNow
            };

            await _repository.AddAsync(task);
            return MapToDto(task);
        }

        public async Task UpdateTaskAsync(int id, TaskUpdateDto taskDto)
        {
            var task = await _repository.GetByIdAsync(id);
            if (task == null)
                throw new KeyNotFoundException("Tarefa não encontrada");

            if (taskDto.CompletionDate.HasValue && taskDto.CompletionDate < task.CreationDate)
                throw new ArgumentException("Data de conclusão inválida");

            task.Title = taskDto.Title;
            task.Description = taskDto.Description;
            task.Status = taskDto.Status;
            task.CompletionDate = taskDto.Status == StatusTask.Concluída
                ? taskDto.CompletionDate ?? DateTime.UtcNow
                : null;

            await _repository.UpdateAsync(task);
        }

        public async Task DeleteAsync(int id)
        {
            await _repository.DeleteAsync(id);
        }

        private static TaskResponseDto MapToDto(TaskManager task)
        {
            return new TaskResponseDto
            {
                Id = task.Id,
                Title = task.Title,
                Description = task.Description,
                CreationDate = task.CreationDate,
                CompletionDate = task.CompletionDate,
                Status = task.Status
            };
        }
    }
}
