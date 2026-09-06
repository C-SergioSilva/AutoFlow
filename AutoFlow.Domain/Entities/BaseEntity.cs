namespace AutoFlow.Domain.Entities
{
    public abstract class BaseEntity
    {
        public int Id { get; set; } // ID inteiro auto-incremento
        public DateTime CreatedAt { get; set; } = DateTime.Now; // Data de criação automática
        public bool Deleted { get; set; } = false; // Controle de exclusão lógica
    }
}