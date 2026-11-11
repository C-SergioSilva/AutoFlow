using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class VeiculoApiController : ControllerBase
{
    private readonly IVeiculoService veiculoService;

    public VeiculoApiController(IVeiculoService veiculoService)
    {
        this.veiculoService = veiculoService;
    }

    [HttpGet("paginados")]
    public async Task<IActionResult> ObterPaginados([FromQuery] int pagina = 1, [FromQuery] int quantidade = 10,
        [FromQuery] string placa = null, [FromQuery] string modelo = null, [FromQuery] int? clienteId = null)
        => Ok(await veiculoService.ObterVeiculosPaginadosAsync(pagina, quantidade, placa, modelo, clienteId));

    [HttpGet("{id:int}")]
    public async Task<IActionResult> ObterPorId(int id)
        => Ok(await veiculoService.ObterVeiculoPorId(id));

    [HttpPost]
    public async Task<IActionResult> Criar([FromBody] VeiculoVM veiculo)
    {
        var criado = await veiculoService.AdicionarSalvar(veiculo);
        return CreatedAtAction(nameof(ObterPorId), new { id = criado.Id }, criado);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Atualizar(int id, [FromBody] VeiculoVM veiculo)
    {
        veiculo.Id = id;                       // a URL é a fonte da verdade
        return Ok(await veiculoService.AtualizarVeiculo(veiculo));
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Excluir(int id)
    {
        await veiculoService.StatusDeletado(id);
        return NoContent();
    }
}