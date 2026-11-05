namespace AutoFlow.Domain.Entidades
{
    public abstract class BaseEntity
    {
        public int Id { get; set; } // ID inteiro auto-incremento
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Data de criação automática
        public DateTime? UpdatedAt { get; set; }      // null = nunca foi alterado
        public bool Deleted { get; set; } = false; // Controle de exclusão lógica
    }
}