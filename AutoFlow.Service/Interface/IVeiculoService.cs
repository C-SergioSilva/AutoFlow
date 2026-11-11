using AutoFlow.Domain.Entidades;
using AutoFlow.Service.ViewsModel;

public interface IVeiculoService
{
    Task<PagedResult<VeiculoVM>> ObterVeiculosPaginadosAsync(int pagina, int quantidade, string placa, string modelo, int? clienteId);
    Task<VeiculoVM> ObterVeiculoPorId(int id);
    Task<VeiculoVM> AdicionarSalvar(VeiculoVM veiculo);
    Task<VeiculoVM> AtualizarVeiculo(VeiculoVM veiculo);
    Task StatusDeletado(int id);
}