// ==========================================
// UTILITÁRIO GLOBAL DE MÁSCARAS E FORMATAÇÃO
// ==========================================
export function formatarDocumento(documento, tipoCliente) {
    if (!documento) return "";

    let valor = "";

    // 1. Se o tipo selecionado for CPF (1)
    if (tipoCliente === 1 || tipoCliente === "1" || tipoCliente === "Cpf") {
        // CPF aceita estritamente números
        valor = documento.replace(/\D/g, "");

        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }

        return valor
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // 2. Se o tipo selecionado for CNPJ (2) - AGORA ALFANUMÉRICO!
    else if (tipoCliente === 2 || tipoCliente === "2" || tipoCliente === "Cnpj") {
        // Remove tudo que não for letra ou número (mantém alfanumérico) e deixa em maiúsculo para padronizar
        valor = documento.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

        if (valor.length > 14) {
            valor = valor.substring(0, 14);
        }

        // Aplicamos a máscara de CNPJ aceitando letras e números ([a-zA-Z0-9])
        return valor
            .replace(/^([a-zA-Z0-9]{2})([a-zA-Z0-9])/, "$1.$2")
            .replace(/^([a-zA-Z0-9]{2})\.([a-zA-Z0-9]{3})([a-zA-Z0-9])/, "$1.$2.$3")
            .replace(/\.([a-zA-Z0-9]{3})([a-zA-Z0-9])/, ".$1/$2")
            .replace(/([a-zA-Z0-9]{4})([a-zA-Z0-9])/, "$1-$2");
    }

    return valor;
}
    
export function formatarTelefone(telefone) { //formatarTelefone
    if (!telefone) return "";

    let valor = telefone.replace(/\D/g, "");

    // 2. Trava o limite máximo de dígitos para 11 (ex: DDD + 9 dígitos)
    if (valor.length > 11) {
        valor = valor.substring(0, 11);
    }

    // Celular com 11 dígitos (ex: 85988887777)
    if (valor.length === 11) {
        return valor.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }
    // Telefone fixo com 10 dígitos (ex: 8533334444)
    if (valor.length === 10) {
        return valor.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    }

    // Caso venha com 12 dígitos (ex: algum prefixo ou DDI 55 junto: 5585988887777)
    // Caso venha com 12 dígitos (ex: DDI + DDD + 8 dígitos)
    if (valor.length === 12) {
        return valor.replace(/(\d{2})(\d{2})(\d{4})(\d{4})/, "+$1 ($2) $3-$4");
    }
    // Se vier com 13 dígitos (DDI + DDD + Celular)
    if (valor.length === 13) {
        return valor.replace(/(\d{2})(\d{2})(\d{5})(\d{4})/, "+$1 ($2) $3-$4");
    }

    return telefone;
}

// Função para mascarar parte do CPF ou CNPJ para exibição visual segura
export function mascararDocumentoParcial(documento) {
    if (!documento) return "Não informado";

    // Se tiver tamanho de CNPJ (14), limpamos mantendo letras e números. Se for CPF (11), limpamos apenas números.
    let limpo = "";

    // Verificação simples pelo tamanho bruto sem máscara (11 = CPF, 14 = CNPJ)
    const soDigitosOuLetras = documento.replace(/[^a-zA-Z0-9]/g, "");

    if (soDigitosOuLetras.length === 11) {
        limpo = documento.replace(/\D/g, "");
        return `***.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-**`;
    }
    else if (soDigitosOuLetras.length === 14) {
        limpo = documento.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
        return `**.***.${limpo.substring(5, 8)}/${limpo.substring(8, 12)}-**`;
    }

    return "***.***.***-**";
}