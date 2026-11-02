using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Enum;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

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
            // PASSO 1: Perguntar ao banco quantos registros existem no total
            int totalRegistros = await Queryable()
                .Where(c => (string.IsNullOrEmpty(nome) || c.Nome.Contains(nome)) &&
                            (!tipoDocumento.HasValue || c.Tipo == (TipoCliente)tipoDocumento.Value) &&
                            (string.IsNullOrEmpty(documento) || c.Documento.Contains(documento)))
                .CountAsync();

            // PASSO 2: Buscar apenas a fatia (página) que o usuário quer ver
            var clientesDaPagina = await Queryable()
                .Where(c => (string.IsNullOrEmpty(nome) || c.Nome.Contains(nome)) &&
                            (!tipoDocumento.HasValue || c.Tipo == (TipoCliente)tipoDocumento.Value) &&
                            (string.IsNullOrEmpty(documento) || c.Documento.Contains(documento)))
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
        public async Task MarcarComoDeletadoClienteEVeiculo(int clienteId) 
        {
            // Usamos o DbSet genérico ou fazemos cast do contexto para AppDbContext
            var dbContext = (AppDbContext)context;

            var cliente = await dbContext.Clientes.FindAsync(clienteId);
            if (cliente != null)
            {
                cliente.Deleted = true;
                dbContext.Clientes.Update(cliente);

                // Atualiza os veículos em lote de forma ultra rápida com o DbSet de veículos
                await dbContext.Set<Veiculo>()
                    .Where(v => v.ClienteId == clienteId && !v.Deleted)
                    .ExecuteUpdateAsync(s => s.SetProperty(v => v.Deleted, true));

                await dbContext.SaveChangesAsync();
            }
        }

    }
}
