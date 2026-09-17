// ==========================================
// UTILITÁRIO GLOBAL DE MÁSCARAS E FORMATAÇÃO
// ==========================================

export function formatarDocumento(documento, tipoCliente) {
    if (!documento) return "";

    // 1. Remove tudo que não for número
    let valor = documento.replace(/\D/g, "");

    // 2. Se o tipo selecionado for CPF (tipo 1 ou string "1" ou "CPF")
    if (tipoCliente === 1 || tipoCliente === "1" || tipoCliente === "Cpf") {
        // Trava estritamente em 11 dígitos
        if (valor.length > 11) {
            valor = valor.substring(0, 11);
        }
        // Aplica a máscara de CPF
        return valor
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d)/, "$1.$2")
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    }

    // 3. Se o tipo selecionado for CNPJ (tipo 2 ou string "2" ou "Cnpj")
    else if (tipoCliente === 2 || tipoCliente === "2" || tipoCliente === "Cnpj") {
        // Trava estritamente em 14 dígitos
        if (valor.length > 14) {
            valor = valor.substring(0, 14);
        }
        // Aplica a máscara de CNPJ
        return valor
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2");
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

    // Remove tudo que não for número para garantir a formatação limpa
    const limpo = documento.replace(/\D/g, "");

    // Se for CPF (11 dígitos)
    if (limpo.length === 11) {
        // Exemplo: Esconde os 3 primeiros e os 2 últimos, ou mostra só o final
        // Resultado visual: ***.456.654-**
        return `***.${limpo.substring(3, 6)}.${limpo.substring(6, 9)}-**`;
    }

    // Se for CNPJ (14 dígitos)
    else if (limpo.length === 14) {
        // Resultado visual: **.***.***/0001-**
        return `**.***.${limpo.substring(5, 8)}/${limpo.substring(8, 12)}-**`;
    }

    // Se não se encaixar em nenhum, retorna mascarado genérico
    return "***.***.***-**";
}