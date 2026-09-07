using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Enum;

namespace AutoFlow.Service.ViewsModel
{
    public class ClienteVM
    {
        public int Id { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public string Nome { get; set; } = string.Empty;
        public string TelefoneWhatsApp { get; set; } = string.Empty;
        public TipoCliente Tipo { get; set; } // PF ou PJ
        public string Documento { get; set; } = string.Empty; // CPF ou CNPJ

        // Propriedade de navegação: Um cliente possui uma lista de veículos
        public ICollection<VeiculoVM> Veiculos { get; set; } = new List<VeiculoVM>();
    }
}
