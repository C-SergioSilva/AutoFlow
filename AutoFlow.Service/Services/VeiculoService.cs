using AutoFlow.Domain.Entidades;
using AutoFlow.Domain.Excecoes;
using AutoFlow.Domain.Interfacees;
using AutoFlow.Domain.Utils;
using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using AutoMapper;

namespace AutoFlow.Service.Services
{
    public class VeiculoService : IVeiculoService
    {
        private const int QuantidadeMaximaPorPagina = 50;

        private readonly IMapper map;
        private readonly IVeiculoRepositorio repositorio;
        private readonly IClienteRepositorio clienteRepositorio;

        public VeiculoService(IMapper map, IVeiculoRepositorio repositorio, IClienteRepositorio clienteRepositorio)
        {
            this.map = map;
            this.repositorio = repositorio;
            this.clienteRepositorio = clienteRepositorio;
        }

        public async Task<PagedResult<VeiculoVM>> ObterVeiculosPaginadosAsync(
            int pagina, int quantidade, string placa, string modelo, int? clienteId)
        {
            if (pagina < 1) pagina = 1;
            if (quantidade < 1) quantidade = 10;
            if (quantidade > QuantidadeMaximaPorPagina) quantidade = QuantidadeMaximaPorPagina;

            var placaLimpa = ValidadorVeiculo.LimparPlaca(placa);
            if (placaLimpa.Length is > 0 and < 3)
                throw new RegraDeNegocioException("O filtro por placa precisa ter pelo menos 3 caracteres.");

            var modeloLimpo = modelo?.Trim();
            if (modeloLimpo is { Length: > 0 and < 3 })
                throw new RegraDeNegocioException("O filtro por marca ou modelo precisa ter pelo menos 3 caracteres.");

            var resultado = await repositorio.ObterVeiculosPaginadosAsync(
                pagina, quantidade, placaLimpa, modeloLimpo, clienteId);

            return new PagedResult<VeiculoVM>
            {
                Items = map.Map<List<VeiculoVM>>(resultado.Items),
                PageNumber = resultado.PageNumber,
                PageSize = resultado.PageSize,
                TotalRecords = resultado.TotalRecords
            };
        }

        public async Task<VeiculoVM> ObterVeiculoPorId(int id)
        {
            var veiculo = await repositorio.ObterPorIdComClienteAsync(id)
                ?? throw new NaoEncontradoException("Veículo não encontrado.");
            return map.Map<VeiculoVM>(veiculo);
        }

        public async Task<VeiculoVM> AdicionarSalvar(VeiculoVM vm)
        {
            await ValidarEPadronizarAsync(vm, null);

            var entidade = map.Map<Veiculo>(vm);
            entidade.Id = 0;                       // nunca confie em Id vindo de fora na criação
            await repositorio.AdicionarESalvar(entidade);

            return await ObterVeiculoPorId(entidade.Id);   // recarrega já com o nome do cliente
        }

        public async Task<VeiculoVM> AtualizarVeiculo(VeiculoVM vm)
        {
            var entidade = await repositorio.ObterPorId(vm.Id)
                ?? throw new NaoEncontradoException("Veículo não encontrado.");

            await ValidarEPadronizarAsync(vm, vm.Id);

            map.Map(vm, entidade);                 // altera só os campos do formulário
            await repositorio.Commit();

            return await ObterVeiculoPorId(entidade.Id);
        }

        public async Task StatusDeletado(int id)
        {
            _ = await repositorio.ObterPorId(id)
                ?? throw new NaoEncontradoException("Veículo não encontrado.");
            await repositorio.MarcarComoDeletadoPorId(id);
        }

        // Toda a regra de validação em UM lugar, usada pelo cadastro e pela edição
        private async Task ValidarEPadronizarAsync(VeiculoVM vm, int? idAtual)
        {
            vm.Placa = ValidadorVeiculo.LimparPlaca(vm.Placa);
            if (!ValidadorVeiculo.PlacaValida(vm.Placa))
                throw new RegraDeNegocioException("Placa inválida. Use o formato ABC1234 ou ABC1D23.");
            if (await repositorio.ExistePlacaAsync(vm.Placa, idAtual))
                throw new RegraDeNegocioException("Já existe um veículo cadastrado com esta placa.");

            vm.Chassi = ValidadorVeiculo.LimparChassi(vm.Chassi);
            if (vm.Chassi != null)
            {
                if (!ValidadorVeiculo.ChassiValido(vm.Chassi))
                    throw new RegraDeNegocioException("Chassi inválido. Ele deve ter 17 caracteres (sem I, O ou Q).");
                if (await repositorio.ExisteChassiAsync(vm.Chassi, idAtual))
                    throw new RegraDeNegocioException("Já existe um veículo cadastrado com este chassi.");
            }

            if (string.IsNullOrWhiteSpace(vm.Marca)) throw new RegraDeNegocioException("Informe a marca.");
            if (string.IsNullOrWhiteSpace(vm.Modelo)) throw new RegraDeNegocioException("Informe o modelo.");
            vm.Marca = vm.Marca.Trim();
            vm.Modelo = vm.Modelo.Trim();
            vm.Cor = string.IsNullOrWhiteSpace(vm.Cor) ? null : vm.Cor.Trim();

            if (vm.Quilometragem < 0)
                throw new RegraDeNegocioException("A quilometragem não pode ser negativa.");
            if (vm.AnoModelo.HasValue && (vm.AnoModelo < 1900 || vm.AnoModelo > DateTime.UtcNow.Year + 1))
                throw new RegraDeNegocioException("Ano do modelo inválido.");

            if (await clienteRepositorio.ObterPorId(vm.ClienteId) == null)
                throw new RegraDeNegocioException("O cliente informado não existe.");
        }
    }
}