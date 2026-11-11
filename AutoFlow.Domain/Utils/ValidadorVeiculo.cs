using System.Text.RegularExpressions;

namespace AutoFlow.Domain.Utils
{
    public static class ValidadorVeiculo
    {
        // ABC1234 (antiga) ou ABC1D23 (Mercosul)
        private static readonly Regex PlacaRegex = new("^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$", RegexOptions.Compiled);
        // 17 caracteres, sem I, O, Q (padrão internacional do chassi)
        private static readonly Regex ChassiRegex = new("^[A-HJ-NPR-Z0-9]{17}$", RegexOptions.Compiled);

        public static string LimparPlaca(string placa) => Normalizar(placa);
        public static bool PlacaValida(string placa) => !string.IsNullOrEmpty(placa) && PlacaRegex.IsMatch(placa);

        public static string LimparChassi(string chassi)
        {
            var limpo = Normalizar(chassi);
            return string.IsNullOrEmpty(limpo) ? null : limpo;   // vazio vira null (campo opcional)
        }
        public static bool ChassiValido(string chassi) => chassi != null && ChassiRegex.IsMatch(chassi);

        private static string Normalizar(string texto) =>
            string.IsNullOrWhiteSpace(texto)
                ? string.Empty
                : new string(texto.Where(char.IsLetterOrDigit).ToArray()).ToUpperInvariant();
    }
}