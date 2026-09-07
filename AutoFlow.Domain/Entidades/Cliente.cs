using AutoFlow.Domain.Enum;

namespace AutoFlow.Domain.Entidades
{
    public class Cliente : BaseEntity
    {
        public string Nome { get; set; } = string.Empty;
        public string TelefoneWhatsApp { get; set; } = string.Empty;
        public TipoCliente Tipo { get; set; } // PF ou PJ
        public string Documento { get; set; } = string.Empty; // CPF ou CNPJ

        // Propriedade de navegação: Um cliente possui uma lista de veículos
        public ICollection<Veiculo> Veiculos { get; set; } = new List<Veiculo>();
    }
}
