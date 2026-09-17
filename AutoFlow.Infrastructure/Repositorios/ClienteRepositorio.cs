using AutoFlow.Domain.Entidades;
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

        public async Task<PagedResult<Cliente>> ObterClientesPaginadosAsync(int pagina, int quantidade)
        {
            // PASSO 1: Perguntar ao banco quantos registros existem no total
            int totalRegistros = await Queryable().CountAsync();

            // PASSO 2: Buscar apenas a fatia (página) que o usuário quer ver
            var clientesDaPagina = await Queryable()
                .Include(c => c.Veiculos)       // Traz os veículos do cliente junto (sua regra de negócio)
                .OrderBy(c => c.Nome)           // IMPORTANTE: Ordena em ordem alfabética para o salto funcionar direito
                .Skip((pagina - 1) * quantidade)// Pula os registros das páginas anteriores
                .Take(quantidade)               // Pega apenas a quantidade exata que o usuário pediu (ex: 10)
                .ToListAsync();                 // AGORA SIM! Executa o comando no banco e traz só esses 10 para a memória!

            // PASSO 3: Empacotar tudo e devolver
            return new PagedResult<Cliente>
            {
                Items = clientesDaPagina,
                PageNumber = pagina,
                PageSize = quantidade,
                TotalRecords = totalRegistros
            };
        }


    }
}
