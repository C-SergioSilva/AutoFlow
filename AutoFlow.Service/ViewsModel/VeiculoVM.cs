using AutoFlow.Domain.Entidades;

namespace AutoFlow.Service.ViewsModel
{
    public class VeiculoVM
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string Placa { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int Quilometragem { get; set; }
        public int ClienteId { get; set; }
    }
}
