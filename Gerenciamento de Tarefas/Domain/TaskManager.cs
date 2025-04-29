namespace Gerenciamento_de_Tarefas.Domain
{
    public class TaskManager
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.UtcNow;
        public DateTime? CompletionDate { get; set; }
        public StatusTask Status { get; set; } = StatusTask.Pendente;
    }
}
