using System.ComponentModel.DataAnnotations;
using Gerenciamento_de_Tarefas.Domain;

namespace Gerenciamento_de_Tarefas.Application
{
    public class DTOs
    {
        public class TaskCreateDto
        {
            [Required(ErrorMessage = "O título é obrigatório")]
            [MaxLength(100, ErrorMessage = "O título não pode ter mais que 100 caracteres")]
            public string Title { get; set; }
            public string Description { get; set; }
            public StatusTask Status { get; set; } = StatusTask.Pendente;
        }

        public class TaskUpdateDto
        {
            [Required(ErrorMessage = "O título é obrigatório")]
            [MaxLength(100, ErrorMessage = "O título não pode ter mais que 100 caracteres")]
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime? CompletionDate { get; set; }
            public StatusTask Status { get; set; }
        }

        public class TaskResponseDto
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public DateTime CreationDate { get; set; }
            public DateTime? CompletionDate { get; set; }
            public StatusTask Status { get; set; }
        }
    }
}
