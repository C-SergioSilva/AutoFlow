namespace AutoFlow.Domain.Entidades
{
    public class Veiculo : BaseEntity
    {
        public string Placa { get; set; } = string.Empty;
        public string Modelo { get; set; } = string.Empty;
        public int Quilometragem { get; set; }

        // Chave estrangeira para ligar o veículo ao Cliente
        public int ClienteId { get; set; }
        public Cliente Cliente { get; set; }
    }
}