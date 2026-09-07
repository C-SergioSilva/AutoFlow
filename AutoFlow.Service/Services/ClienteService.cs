using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using AutoMapper;

namespace AutoFlow.Service.Services
{
    public class ClienteService : IClienteService
    {
        protected readonly IMapper map;
        protected readonly IClienteRepositorio repositorio;
        public ClienteService(IMapper map, IClienteRepositorio repositorio)
        {
            this.map = map;
            this.repositorio = repositorio;
        }

        public async Task<ViewsModel.ClienteVM> AdicionarSalvar(ViewsModel.ClienteVM clienteVM)
        {
            try
            {
                var clienteEntidade = map.Map<Domain.Entidades.Cliente>(clienteVM);
                var clienteAdicionado = await repositorio.AdicionarESalvar(clienteEntidade);
                return map.Map<ViewsModel.ClienteVM>(clienteAdicionado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<ViewsModel.ClienteVM> AtualizarCliente(ViewsModel.ClienteVM clienteVM)
        {
            try
            {
                var clienteEntidade = map.Map<Domain.Entidades.Cliente>(clienteVM);
                var clienteAtualizado = await repositorio.Atualizar(clienteEntidade);
                return map.Map<ViewsModel.ClienteVM>(clienteAtualizado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<ViewsModel.ClienteVM> ObterClientePorId(int Id)
        {
            try
            {
                var clienteEntidade = await repositorio.ObterPorId(Id);
                return map.Map<ViewsModel.ClienteVM>(clienteEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<ViewsModel.ClienteVM>> ObterTodos()
        {
            try
            {
                var clientesEntidade = await repositorio.ObterTodos();
                return map.Map<IEnumerable<ViewsModel.ClienteVM>>(clientesEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<ViewsModel.ClienteVM>> ObterTodosClientesEVeiculos()
        {
            try
            {
                var clientesEntidade = await repositorio.ObterTodosClientesEVeiculos();
                return map.Map<IEnumerable<ViewsModel.ClienteVM>>(clientesEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<VeiculoVM>> ObterVeiculos()
        {
            try
            {
                var veiculosEntidade = await repositorio.ObterTodos();
                return map.Map<IEnumerable<VeiculoVM>>(veiculosEntidade);   
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task StatusDeletado(int Id)
        {
            try
            {
                await repositorio.MarcarComoDeletadoPorId(Id);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }
    }
}
