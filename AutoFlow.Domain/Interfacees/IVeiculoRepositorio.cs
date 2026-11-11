using AutoFlow.Domain.Entidades;

namespace AutoFlow.Domain.Interfacees
{
    public interface IVeiculoRepositorio : IBaseRepositorio<Veiculo>
    {
        Task<IEnumerable<Veiculo>> ObterTodosVeiculosEClientes();
        Task<PagedResult<Veiculo>> ObterVeiculosPaginadosAsync(int pagina, int quantidade, string placa, string modelo, int? clienteId);
        Task<Veiculo> ObterPorIdComClienteAsync(int id);
        Task<bool> ExistePlacaAsync(string placa, int? ignorarId = null);
        Task<bool> ExisteChassiAsync(string chassi, int? ignorarId = null);
    }
}
