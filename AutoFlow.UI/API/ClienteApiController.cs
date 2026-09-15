using AutoFlow.Service.Interface;
using AutoFlow.Service.ViewsModel;
using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ClienteApiController : ControllerBase // ou ClienteApiController
{
    private readonly IClienteService _clienteService;

    public ClienteApiController(IClienteService clienteService)
    {
        _clienteService = clienteService;
    }

    [HttpGet]
    public async Task<IActionResult> ObterTodos()
    {
        try
        {
            // Aqui o serviço busca no banco e a API devolve o JSON puro
            var lista = await _clienteService.ObterTodos();
            return Ok(lista);
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message, ex);
        }

    }

    [HttpPost]
    public async Task<IActionResult> AdicionarSalvar([FromBody] ClienteVM cliente)
    {
        try
        {
            var resultado = new ClienteVM();

            if (cliente == null)
            {
                return BadRequest("Cliente inválido.");
            }

            if (cliente.Id > 0)
            {
                 resultado = await _clienteService.AtualizarCliente(cliente);
                return CreatedAtAction(nameof(ObterTodos), new { id = resultado.Id }, resultado);
            }

             resultado = await _clienteService.AdicionarSalvar(cliente);
            return CreatedAtAction(nameof(ObterTodos), new { id = resultado.Id }, resultado);
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message,  ex);
        }
        
        
       
    }
}