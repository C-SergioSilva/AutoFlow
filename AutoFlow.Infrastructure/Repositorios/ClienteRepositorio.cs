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
    }
}
