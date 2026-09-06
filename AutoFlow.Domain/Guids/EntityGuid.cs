namespace AutoFlow.Domain.Guids
{
    public class EntityGuid
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public DateTime CreateAt { get; set; } = DateTime.Now;

        public bool Deleted { get; set; } = false;
    }
}
