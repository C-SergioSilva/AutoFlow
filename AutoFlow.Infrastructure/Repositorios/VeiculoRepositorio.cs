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

        public async Task<PagedResult<Veiculo>> ObterVeiculosPaginadosAsync(int pagina, int quantidade, string placa, string modelo, int? clienteId)
        {
            // A consulta é montada UMA vez e reaproveitada na contagem e na página
            var consulta = Queryable().AsNoTracking();

            if (!string.IsNullOrWhiteSpace(placa))
                consulta = consulta.Where(v => v.Placa.Contains(placa));
            if (!string.IsNullOrWhiteSpace(modelo))
                consulta = consulta.Where(v => v.Modelo.Contains(modelo) || v.Marca.Contains(modelo));
            if (clienteId.HasValue)
                consulta = consulta.Where(v => v.ClienteId == clienteId.Value);

            var total = await consulta.CountAsync();

            var itens = await consulta
                .Include(v => v.Cliente)
                .OrderBy(v => v.Placa)
                .Skip((pagina - 1) * quantidade)
                .Take(quantidade)
                .ToListAsync();

            return new PagedResult<Veiculo>
            {
                Items = itens,
                PageNumber = pagina,
                PageSize = quantidade,
                TotalRecords = total
            };
        }

        public async Task<Veiculo> ObterPorIdComClienteAsync(int id) =>
            await Queryable().AsNoTracking().Include(v => v.Cliente).SingleOrDefaultAsync(v => v.Id == id);

        public async Task<bool> ExistePlacaAsync(string placa, int? ignorarId = null) =>
            await Queryable().AnyAsync(v => v.Placa == placa && (ignorarId == null || v.Id != ignorarId));

        public async Task<bool> ExisteChassiAsync(string chassi, int? ignorarId = null) =>
            await Queryable().AnyAsync(v => v.Chassi == chassi && (ignorarId == null || v.Id != ignorarId));
    }
}
