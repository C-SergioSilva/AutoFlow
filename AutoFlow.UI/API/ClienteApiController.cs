using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ClienteApiController : ControllerBase // ou ClienteApiController
{
    private readonly IClienteService clienteService;

    public ClienteApiController(IClienteService clienteService)
    {
        this.clienteService = clienteService;
    }

    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        try
        {
            // Aqui o serviço busca no banco e a API devolve o JSON puro
            var lista = await clienteService.ObterTodos();
            return Ok(lista);
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message, ex);
        }

    }

    [HttpGet("paginados")]
    public async Task<IActionResult> ObterClientesPaginados([FromQuery] int pagina = 1, [FromQuery] int quantidade = 10,
    [FromQuery] string nome = null, [FromQuery] int? tipoDocumento = null, [FromQuery] string documento = null)
    => Ok(await clienteService.ObterClientesPaginadosAsync(pagina, quantidade, nome, tipoDocumento, documento));

    [HttpPost]
    public async Task<IActionResult> AdicionarSalvar([FromBody] ClienteVM cliente)
    {
        if (cliente == null)
            return BadRequest("Cliente inválido ou não encontrado.");

        if (cliente.Id > 0)
        {
            var atualizado = await clienteService.AtualizarCliente(cliente);
            return Ok(atualizado);
        }

        var criado = await clienteService.AdicionarSalvar(cliente);
        return CreatedAtAction(nameof(ObterTodos), new { id = criado.Id }, criado);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Deletar(int id)
    {
        await clienteService.MarcarStatusDeletadoClienteVeiculos(id);
        return NoContent();
    }
}