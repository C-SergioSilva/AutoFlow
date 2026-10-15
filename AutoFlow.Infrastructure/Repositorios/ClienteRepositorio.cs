using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Enum;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Text;

namespace AutoFlow.Infrastructure.Repositorios
{
    public class ClienteRepositorio : BaseRepositorio<Cliente>, IClienteRepositorio
    {
        public ClienteRepositorio(AppDbContext context) : base(context){}

        public async Task<IEnumerable<Cliente>> ObterTodosClientesEVeiculos()
        {
            return await Queryable()
                .Include(c => c.Veiculos)
                .ToListAsync();
        }

        public async Task<PagedResult<Cliente>> ObterClientesPaginadosAsync(int pagina, int quantidade, string nome, int? tipoDocumento, string documento)
        {
            // 1. Limpa a máscara do documento caso ele venha preenchido (deixa apenas números/letras puros para bater com o banco)

            var documentoLimpo = Limpardocumento(documento);

            // PASSO 1: Perguntar ao banco quantos registros existem no total
            int totalRegistros = await Queryable()
                .Where(c => (string.IsNullOrEmpty(nome) || c.Nome.Contains(nome)) &&
                            (!tipoDocumento.HasValue || c.Tipo == (TipoCliente)tipoDocumento.Value) &&
                            (string.IsNullOrEmpty(documentoLimpo) || c.Documento.Contains(documentoLimpo)))
                .CountAsync();

            // PASSO 2: Buscar apenas a fatia (página) que o usuário quer ver
            var clientesDaPagina = await Queryable()
                .Where(c => (string.IsNullOrEmpty(nome) || c.Nome.Contains(nome)) &&
                            (!tipoDocumento.HasValue || c.Tipo == (TipoCliente)tipoDocumento.Value) &&
                            (string.IsNullOrEmpty(documentoLimpo) || c.Documento.Contains(documentoLimpo)))
                .Include(c => c.Veiculos)        // Traz os veículos do cliente junto (sua regra de negócio)   
                .OrderBy(c => c.Nome)            // IMPORTANTE: Ordena em ordem alfabética para o salto funcionar direito       
                .Skip((pagina - 1) * quantidade) // Pula os registros das páginas anteriores
                .Take(quantidade)                // Pega apenas a quantidade exata que o usuário pediu (ex: 10)
                .ToListAsync();                  
                                                
            // PASSO 3: Empacotar tudo e devolve // AGORA SIM! Executa o comando no banco e traz só esses 10 para a memória!r
            return new PagedResult<Cliente>
            {
                Items = clientesDaPagina,
                PageNumber = pagina,
                PageSize = quantidade,
                TotalRecords = totalRegistros
            };
        }

        public string Limpardocumento(string documento)
        {
            // Se o documento veio preenchido, removemos tudo o que não for letra ou número 
            // (Isso garante que pontos, traços, barras e espaços voem pelo ar e fique só o valor puro!)
            if (!string.IsNullOrEmpty(documento))
            {
                documento = new string(documento.Where(char.IsLetterOrDigit).ToArray());
            }

            return documento;
        } 


    }
}
