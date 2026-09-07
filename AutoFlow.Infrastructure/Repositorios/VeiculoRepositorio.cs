using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AutoFlow.Infrastructure.Repositorios
{
    public class VeiculoRepositorio : BaseRepositorio<Veiculo>, IVeiculoRepositorio
    {
        public VeiculoRepositorio(AppDbContext context) : base(context){}

        public async Task<IEnumerable<Veiculo>> ObterTodosVeiculosEClientes()
        { 
            return await Queryable()
                .Include(v => v.Cliente)
                .ToListAsync();
        }
    }
}
