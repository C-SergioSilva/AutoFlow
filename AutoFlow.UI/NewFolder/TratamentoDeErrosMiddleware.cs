using AutoFlow.Domain.Excecoes;
using Microsoft.AspNetCore.Mvc;

namespace AutoFlow.UI.Middlewares
{
    public class TratamentoDeErrosMiddleware
    {
        private readonly RequestDelegate _proximo;
        private readonly ILogger<TratamentoDeErrosMiddleware> _logger;

        public TratamentoDeErrosMiddleware(RequestDelegate proximo, ILogger<TratamentoDeErrosMiddleware> logger)
        {
            _proximo = proximo;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _proximo(context);
            }
            catch (Exception ex) when (context.Request.Path.StartsWithSegments("/api") && !context.Response.HasStarted)
            {
                var (status, titulo, detalhe) = ex switch
                {
                    NaoEncontradoException => (StatusCodes.Status404NotFound, "Não encontrado", ex.Message),
                    RegraDeNegocioException => (StatusCodes.Status400BadRequest, "Regra de negócio", ex.Message),
                    _ => (StatusCodes.Status500InternalServerError, "Erro interno",
                          "Ocorreu um erro inesperado. Tente novamente.")
                };

                // Erro inesperado: o detalhe técnico vai para o LOG, nunca para o usuário
                if (status == 500)
                    _logger.LogError(ex, "Erro não tratado em {Caminho}", context.Request.Path);

                context.Response.StatusCode = status;
                await context.Response.WriteAsJsonAsync(new ProblemDetails
                {
                    Status = status,
                    Title = titulo,
                    Detail = detalhe
                });
            }
        }
    }
}