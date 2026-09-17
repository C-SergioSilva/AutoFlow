using AutoFlow.Domain.Entidades;
using AutoFlow.Service.ViewsModel;

namespace AutoFlow.Service.Interface
{
    public interface IClienteService
    {
        Task<ClienteVM> AdicionarSalvar(ClienteVM clienteVM);
        Task<IEnumerable<ClienteVM>> ObterTodosClientesEVeiculos(); 
        Task<IEnumerable<ClienteVM>> ObterTodos();
        Task<ClienteVM> ObterClientePorId(int Id);
        Task<ClienteVM> AtualizarCliente (ClienteVM clienteVM);
        Task StatusDeletado(int Id); 
        Task<IEnumerable<VeiculoVM>> ObterVeiculos();
        Task<PagedResult<ClienteVM>> ObterClientesPaginadosAsync(int pagina, int quantidade);
    }
}
