namespace AutoFlow.Domain.Excecoes
{
    // Regra de negócio violada -> HTTP 400
    public class RegraDeNegocioException : Exception
    {
        public RegraDeNegocioException(string mensagem) : base(mensagem) { }
    }

    // Registro inexistente -> HTTP 404
    public class NaoEncontradoException : Exception
    {
        public NaoEncontradoException(string mensagem) : base(mensagem) { }
    }
}