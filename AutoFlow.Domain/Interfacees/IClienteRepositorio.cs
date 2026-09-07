using AutoFlow.Domain.Entidades;

namespace AutoFlow.Domain.Interfacees
{
    public interface IClienteRepositorio : IBaseRepositorio<Cliente>
    {
        Task<IEnumerable<Cliente>> ObterTodosClientesEVeiculos(); 
    }
}
