using AutoFlow.Domain.Entidades;

namespace AutoFlow.Domain.Interfacees
{
    public interface IVeiculoRepositorio : IBaseRepositorio<Veiculo>
    {
        Task<IEnumerable<Veiculo>> ObterTodosVeiculosEClientes(); 
    }
}
