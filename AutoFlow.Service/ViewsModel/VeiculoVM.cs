using AutoFlow.Domain.Enum;

namespace AutoFlow.Service.ViewsModel
{
    public class VeiculoVM
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        public string Placa { get; set; } = string.Empty;
        public string Chassi { get; set; }
        public string Marca { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int? AnoModelo { get; set; }
        public string Cor { get; set; }
        public TipoCombustivel Combustivel { get; set; }
        public int Quilometragem { get; set; }

        public int ClienteId { get; set; }
        public string ClienteNome { get; set; }   // só leitura: o AutoMapper preenche sozinho
    }
}