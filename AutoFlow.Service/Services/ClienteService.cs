using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Enum;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Domain.Utils;
using AutoFlow.Infrastructure.Repositorios;
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

        public async Task<ClienteVM> AdicionarSalvar(ClienteVM clienteVM)
        {
            try
            {
                // 1. Limpa o documento para garantir que temos apenas números puros
                clienteVM.Documento = repositorio.Limpardocumento(clienteVM.Documento);

                // 🌟 2. AQUI ENTRA A NOSSA VALIDAÇÃO MATEMÁTICA!
                // Verificamos se o documento foi preenchido e validamos de acordo com o tipo de cliente (CPF ou CNPJ)
                if (!string.IsNullOrEmpty(clienteVM.Documento))
                {
                    // Supondo que você tenha uma propriedade indicando se é Pessoa Física (ex: Tipo == 1) ou Jurídica (ex: Tipo == 2)
                    // Ajuste o nome da propriedade 'Tipo' ou 'TipoPessoa' conforme o seu modelo real.

                    bool documentoEhValido = false;

                    if (clienteVM.Tipo == TipoCliente.Cpf) // Exemplo: 1 para CPF (Pessoa Física)
                    {
                        documentoEhValido = ValidadorDocumentoCPFCNPJ.ValidarCPF(clienteVM.Documento);
                        if (!documentoEhValido)
                        {
                            throw new InvalidOperationException("O CPF informado é inválido!");
                        }
                    }
                    else if (clienteVM.Tipo == TipoCliente.Cnpj) // Exemplo: 2 para CNPJ (Pessoa Jurídica)
                    {
                        documentoEhValido = ValidadorDocumentoCPFCNPJ.ValidarCNPJ(clienteVM.Documento);
                        if (!documentoEhValido)
                        {
                            throw new InvalidOperationException("O CNPJ informado é inválido!");
                        }
                    }
                }

                // 3. Se passou pela validação, prossegue com o mapeamento e salvamento normal
                var clienteEntidade = map.Map<Cliente>(clienteVM);
                var clienteAdicionado = await repositorio.AdicionarESalvar(clienteEntidade);
                return map.Map<ClienteVM>(clienteAdicionado);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException(ex.Message);
            }
        }

        public async Task<ClienteVM> AtualizarCliente(ClienteVM clienteVM)
        {
            try
            {
                clienteVM.Documento = repositorio.Limpardocumento(clienteVM.Documento);
                var clienteEntidade = map.Map<Domain.Entidades.Cliente>(clienteVM);
                var clienteAtualizado = await repositorio.Atualizar(clienteEntidade);
                return map.Map<ClienteVM>(clienteAtualizado);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message, ex);
            }
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

        public async Task<PagedResult<ClienteVM>> ObterClientesPaginadosAsync(int pagina, int quantidade, string nome, int? tipoDocumento, string documento)
        {
            try
            {
                // 1. Chama o repositório que busca os dados paginados lá no banco
                var resultadoRepositorio = await repositorio.ObterClientesPaginadosAsync(pagina, quantidade, nome, tipoDocumento, documento);

                // 2. Usa o AutoMapper para converter a lista de Entidades (Cliente) para ViewModels (ClienteVM)
                var listaVM = map.Map<List<ClienteVM>>(resultadoRepositorio.Items);

                // 3. Monta o PagedResult final contendo os ViewModels e as regras de paginação
                return new PagedResult<ClienteVM>
                {
                    Items = listaVM,
                    PageNumber = resultadoRepositorio.PageNumber,
                    PageSize = resultadoRepositorio.PageSize,
                    TotalRecords = resultadoRepositorio.TotalRecords
                };
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

    }
}
