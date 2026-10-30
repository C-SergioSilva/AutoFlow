// Função para validar CPF no Front-end
export function validarCPF(cpf) {
    // 1. Remove tudo o que não for dígito
    cpf = cpf.replace(/\D/g, '');

    // 2. Verifica se tem 11 dígitos ou se todos são iguais
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
        return false;
    }

    let soma = 0;
    let resto;

    // Cálculo do 1º Dígito Verificador
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;

    soma = 0;
    // Cálculo do 2º Dígito Verificador
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
    }
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;

    return true;
}


export function validarCNPJ(cnpj) {
    if (!cnpj) return false;

    // 1. Remove máscara mantendo letras e números; normaliza para maiúsculo
    cnpj = cnpj.replace(/[^0-9A-Za-z]/g, '').toUpperCase();

    // 2. 12 alfanuméricos + 2 dígitos verificadores numéricos
    if (!/^[0-9A-Z]{12}\d{2}$/.test(cnpj)) return false;

    // 3. Todos os caracteres iguais
    if (/^(.)\1+$/.test(cnpj)) return false;

    const calcularDV = (base) => {
        const pesos = base.length === 12
            ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
            : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

        let soma = 0;
        for (let i = 0; i < base.length; i++) {
            soma += (base.charCodeAt(i) - 48) * pesos[i]; // ASCII - 48
        }
        const resto = soma % 11;
        return resto < 2 ? 0 : 11 - resto;
    };

    const base = cnpj.substring(0, 12);
    const dv1 = calcularDV(base);
    const dv2 = calcularDV(base + dv1);

    return cnpj.endsWith(`${dv1}${dv2}`);
}
