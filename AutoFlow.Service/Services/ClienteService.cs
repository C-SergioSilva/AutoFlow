using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Enum;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Domain.Utils;
using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using AutoFlow.Domain.Excecoes;
using AutoMapper;

namespace AutoFlow.Service.Services
{
    public class ClienteService : IClienteService
    {
        protected readonly IMapper map;
        protected readonly IClienteRepositorio repositorio;
        private const int QuantidadeMaximaPorPagina = 50;
        public ClienteService(IMapper map, IClienteRepositorio repositorio)
        {
            this.map = map;
            this.repositorio = repositorio;
        }

        public async Task<ClienteVM> AdicionarSalvar(ClienteVM clienteVM)
        {
            ValidarDocumento(clienteVM);

            var clienteEntidade = map.Map<Cliente>(clienteVM);
            var clienteAdicionado = await repositorio.AdicionarESalvar(clienteEntidade);
            return map.Map<ClienteVM>(clienteAdicionado);
        }

        public async Task<ClienteVM> AtualizarCliente(ClienteVM clienteVM)
        {
            var clienteEntidade = await repositorio.ObterPorId(clienteVM.Id)
                ?? throw new NaoEncontradoException("Cliente não encontrado.");

            // Só estes campos podem ser editados.
            // Documento e Tipo NÃO entram aqui: mudar documento exigirá perfil de gerente e auditoria (pendência nº 3).
            clienteEntidade.Nome = clienteVM.Nome;
            clienteEntidade.TelefoneWhatsApp = clienteVM.TelefoneWhatsApp;

            await repositorio.Commit();

            return map.Map<ClienteVM>(clienteEntidade);
        }

        public async Task<ClienteVM> ObterClientePorId(int Id)
        {
            try
            {
                var clienteEntidade = await repositorio.ObterPorId(Id);
                return map.Map<ClienteVM>(clienteEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<ClienteVM>> ObterTodos()
        {
            try
            {
                var clientesEntidade = await repositorio.ObterTodos();
                return map.Map<IEnumerable<ClienteVM>>(clientesEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task<IEnumerable<ClienteVM>> ObterTodosClientesEVeiculos()
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

        public async Task<PagedResult<ClienteVM>> ObterClientesPaginadosAsync(int pagina, int quantidade, string nome, int? tipoDocumento, string documento)
        {
            if (pagina < 1) pagina = 1;
            if (quantidade < 1) quantidade = 10;
            if (quantidade > QuantidadeMaximaPorPagina) quantidade = QuantidadeMaximaPorPagina;

            var nomeLimpo = nome?.Trim();
            if (nomeLimpo is { Length: > 0 and < 3 })
                throw new RegraDeNegocioException("O filtro por nome precisa ter pelo menos 3 caracteres.");

            documento = ValidadorDocumentoCPFCNPJ.Limpardocumento(documento);

            var resultadoRepositorio = await repositorio.ObterClientesPaginadosAsync(
                pagina, quantidade, nomeLimpo, tipoDocumento, documento);

            return new PagedResult<ClienteVM>
            {
                Items = map.Map<List<ClienteVM>>(resultadoRepositorio.Items),
                PageNumber = resultadoRepositorio.PageNumber,
                PageSize = resultadoRepositorio.PageSize,
                TotalRecords = resultadoRepositorio.TotalRecords
            };
        }

        public async Task MarcarStatusDeletadoClienteVeiculos2(int Id)
        {
            try
            {
                await repositorio.MarcarComoDeletadoClienteEVeiculo(Id); 
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        public async Task MarcarStatusDeletadoClienteVeiculos(int Id) 
        {
            _ = await repositorio.ObterPorId(Id)
                ?? throw new NaoEncontradoException("Cliente não encontrado.");

            await repositorio.MarcarComoDeletadoClienteEVeiculo(Id);
        }

        public async Task MarcarComoDeletado(ClienteVM clienteVM)
        {
            try
            {
                var clienteEntidade = map.Map<Cliente>(clienteVM);
                await repositorio.MarcarComoDeletado(clienteEntidade);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
        }

        // Toda a validação do documento em UM lugar, usada pelo cadastro e pela edição
        private static void ValidarDocumento(ClienteVM clienteVM)
        {
            clienteVM.Documento = ValidadorDocumentoCPFCNPJ.Limpardocumento(clienteVM.Documento);

            if (string.IsNullOrEmpty(clienteVM.Documento)) return;

            if (clienteVM.Tipo == TipoCliente.Cpf && !ValidadorDocumentoCPFCNPJ.ValidarCPF(clienteVM.Documento))
                throw new RegraDeNegocioException("O CPF informado é inválido!");

            if (clienteVM.Tipo == TipoCliente.Cnpj && !ValidadorDocumentoCPFCNPJ.ValidarCNPJ(clienteVM.Documento))
                throw new RegraDeNegocioException("O CNPJ informado é inválido!");
        }

    }
}
