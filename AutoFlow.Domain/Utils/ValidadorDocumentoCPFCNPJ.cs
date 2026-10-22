using System;
using System.Linq;

namespace AutoFlow.Domain.Utils
{
    public static class ValidadorDocumentoCPFCNPJ
    {
        public static bool ValidarCPF(string cpf)
        {
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

            // 1. Remove caracteres não numéricos
            cnpj = new string(cnpj.Where(char.IsDigit).ToArray());

            // 2. Valida tamanho e elimina sequências com todos os dígitos iguais
            if (cnpj.Length != 14 || cnpj.Distinct().Count() == 1)
                return false;

            int[] multiplicadores1 = { 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 };
            int[] multiplicadores2 = { 6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2 }; // Corrigido o último número para 2

            string tempCnpj = cnpj.Substring(0, 12);

            // Cálculo do 1º Dígito Verificador
            int soma = tempCnpj.Select((t, i) => (t - '0') * multiplicadores1[i]).Sum();
            int resto = soma % 11;
            int digito1 = resto < 2 ? 0 : 11 - resto;

            // Cálculo do 2º Dígito Verificador
            tempCnpj += digito1;
            soma = tempCnpj.Select((t, i) => (t - '0') * multiplicadores2[i]).Sum();
            resto = soma % 11;
            int digito2 = resto < 2 ? 0 : 11 - resto;

            return cnpj.EndsWith(digito1.ToString() + digito2.ToString());
        }
    }
}