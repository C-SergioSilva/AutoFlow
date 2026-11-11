
using AutoFlow.Domain.Enum;

namespace AutoFlow.Domain.Entidades
{
    public class Veiculo : BaseEntity
    {
        public string Placa { get; set; } = string.Empty;
        public string Chassi { get; set; }              // opcional
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int? AnoModelo { get; set; }
        public string Cor { get; set; }
        public TipoCombustivel Combustivel { get; set; }
        public int Quilometragem { get; set; }          // KM atual (o histórico por visita ficará na OS)

        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; }
    }
}