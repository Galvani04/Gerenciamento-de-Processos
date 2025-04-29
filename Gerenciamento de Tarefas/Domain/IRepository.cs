namespace Gerenciamento_de_Tarefas.Domain
{
    public interface ITaskRepository
    {
        Task<IEnumerable<TaskManager>> GetAllAsync();
        Task<TaskManager> GetByIdAsync(int id);
        Task<TaskManager> AddAsync(TaskManager task);
        Task UpdateAsync(TaskManager task);
        Task DeleteAsync(int id);
    }
}
