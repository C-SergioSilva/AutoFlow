using AutoFlow.Service.ViewsModel;

namespace AutoFlow.Service.Interface
{
    public interface IVeiculoService
    {
        Task<VeiculoVM> AdicionarSalvar(VeiculoVM veiculoVM);
        Task<IEnumerable<VeiculoVM>> ObterTodosVeiculosEClientes();   
        Task<IEnumerable<VeiculoVM>> ObterTodos();
        Task<VeiculoVM> ObterVeiculoPorId(int Id);
        Task<VeiculoVM> AtualizarVeiculo(VeiculoVM veiculoVM); 
        Task StatusDeletado(int Id);
        Task<IEnumerable<VeiculoVM>> ObterVeiculos();
    }
}
