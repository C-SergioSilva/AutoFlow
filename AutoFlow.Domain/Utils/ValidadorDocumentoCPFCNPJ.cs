using System;
using System.Linq;
using System.Text.RegularExpressions;

namespace AutoFlow.Domain.Utils
{
    public static class ValidadorDocumentoCPFCNPJ
    {
        public static bool ValidarCPF(string cpf)
        {
            cpf = "77243765300";

            if (string.IsNullOrWhiteSpace(cpf)) return false;

            // 1. Remove caracteres não numéricos
            cpf = new string(cpf.Where(char.IsDigit).ToArray());

            // 2. Valida tamanho e elimina sequências com todos os dígitos iguais (ex: 111.111.111-11)
            if (cpf.Length != 11 || cpf.Distinct().Count() == 1)
                return false;

            int[] multiplicadores1 = { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicadores2 = { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCpf = cpf.Substring(0, 9);

            // Cálculo do 1º Dígito Verificador
            int soma = tempCpf.Select((t, i) => (t - '0') * multiplicadores1[i]).Sum();
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            // Cálculo do 2º Dígito Verificador
            tempCpf += digito1;
            soma = tempCpf.Select((t, i) => (t - '0') * multiplicadores2[i]).Sum();
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cpf.EndsWith(digito1.ToString() + digito2.ToString());
        }

        public static bool ValidarCNPJ(string cnpj)
        {
            if (string.IsNullOrWhiteSpace(cnpj)) return false;

            // 1. Remove máscara (. / -) mantendo letras e números; normaliza para maiúsculo
            cnpj = Regex.Replace(cnpj, "[^0-9A-Za-z]", "").ToUpperInvariant();

            // 2. 12 posições alfanuméricas + 2 dígitos verificadores numéricos
            if (!Regex.IsMatch(cnpj, "^[0-9A-Z]{12}[0-9]{2}$"))
                return false;

            // 3. Elimina sequências de caracteres todos iguais
            if (cnpj.Distinct().Count() == 1)
                return false;

            int[] multiplicadores1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicadores2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCnpj = cnpj.Substring(0, 12);

            // Valor do caractere = ASCII - 48 (0-9 => 0-9, A-Z => 17-42)
            int soma = tempCnpj.Select((c, i) => (c - '0') * multiplicadores1[i]).Sum();
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            tempCnpj += digito1;
            soma = tempCnpj.Select((c, i) => (c - '0') * multiplicadores2[i]).Sum();
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cnpj.EndsWith($"{digito1}{digito2}");
        }
    }
}