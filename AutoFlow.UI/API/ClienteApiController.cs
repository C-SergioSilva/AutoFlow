using AutoFlow.Service.Interface;
using AutoFlow.Service.Services;
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

    [HttpGet("paginados")] // Rota que nossa tela vai chamar: /api/cliente/paginados?pagina=1&quantidade=10
    public async Task<IActionResult> ObterClientesPaginados([FromQuery] int pagina = 1, [FromQuery] int quantidade = 10)
    {
        try
        {
            // 1. Validação de segurança básica para evitar valores inválidos
            if (pagina < 1) pagina = 1;
            if (quantidade < 1) quantidade = 10;

            // 2. Chama o serviço que criamos agora pouco
            var resultadoPaginado = await clienteService.ObterClientesPaginadosAsync(pagina, quantidade);

            // 3. Retorna o resultado com sucesso (HTTP 200) contendo nossos dados e metadados
            return Ok(resultadoPaginado);
        }
        catch (Exception ex)
        {
            // 4. Se der qualquer pepino, devolvemos um erro amigável
            return StatusCode(500, new { mensagem = "Erro ao buscar clientes paginados.", detalhes = ex.Message });
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
                 resultado = await clienteService.AtualizarCliente(cliente);
                return CreatedAtAction(nameof(ObterTodos), new { id = resultado.Id }, resultado);
            }

             resultado = await clienteService.AdicionarSalvar(cliente);
            return CreatedAtAction(nameof(ObterTodos), new { id = resultado.Id }, resultado);
        }
        catch (Exception ex)
        {

            throw new Exception(ex.Message,  ex);
        }
        
        
       
    }
}