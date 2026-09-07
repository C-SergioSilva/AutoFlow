using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using AutoMapper;

namespace AutoFlow.Service.Services
{
    public class VeiculoService : IVeiculoService
    {
        protected readonly IMapper map;
        protected readonly IVeiculoRepositorio repositorio;
        public VeiculoService(IMapper map, IVeiculoRepositorio repositorio)
        {
            this.map = map;
            this.repositorio = repositorio;
        }
        public async Task<VeiculoVM> AdicionarSalvar(VeiculoVM veiculoVM)
        {
            try
            {
                var veiculo = map.Map<Veiculo>(veiculoVM);
                var veiculoAdicionado = await repositorio.AdicionarESalvar(veiculo);
                return map.Map<VeiculoVM>(veiculoAdicionado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
            
        }

        public async Task<VeiculoVM> AtualizarVeiculo(VeiculoVM veiculoVM)
        {
            try
            {
                var veiculo = map.Map<Veiculo>(veiculoVM);
                var veiculoAtualizado = await repositorio.Atualizar(veiculo);
                return map.Map<VeiculoVM>(veiculoAtualizado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
            
        }

        public async Task<IEnumerable<VeiculoVM>> ObterTodos()
        {
            try
            {
                var veiculos = await repositorio.ObterTodos();
                return map.Map<IEnumerable<VeiculoVM>>(veiculos);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
            
        }

        public async Task<IEnumerable<VeiculoVM>> ObterTodosVeiculosEClientes() 
        { 
            try
            {
                var veiculos = await repositorio.ObterTodosVeiculosEClientes();
                return map.Map<IEnumerable<VeiculoVM>>(veiculos);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<VeiculoVM> ObterVeiculoPorId(int Id)
        {
            try
            {
                var veiculo = await repositorio.ObterPorId(Id);
                return map.Map<VeiculoVM>(veiculo);
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
                var veiculos = await repositorio.ObterTodos();
                return map.Map<IEnumerable<VeiculoVM>>(veiculos);
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
