using AutoFlow.Service.Interface;
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
        // Aqui o serviço busca no banco e a API devolve o JSON puro
        var lista = await _clienteService.ObterTodos();
        return Ok(lista);
    }
}