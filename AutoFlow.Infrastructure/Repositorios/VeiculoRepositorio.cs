using AutoFlow.Domain.Entities;
using AutoFlow.Domain.Interfacees;
using Microsoft.EntityFrameworkCore;

namespace AutoFlow.Infrastructure.Repositorios
{
    public class VeiculoRepositorio : BaseRepositorio<Veiculo>, IVeiculoRepositorio
    {
        public VeiculoRepositorio(DbContext context) : base(context){}
    }
}
