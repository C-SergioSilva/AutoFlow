// ==========================================
// UTILITÁRIO GLOBAL DE MÁSCARAS E FORMATAÇÃO
// ==========================================

export function formatarCPF(documento) {
    if (!documento) return "";
    let valor = documento.replace(/\D/g, "");

    if (valor.length === 11) {
        return valor.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }
    if (valor.length === 14) {
        return valor.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return documento;
}

export function formatarTelefone(telefone) { //formatarTelefone
    if (!telefone) return "";
    let valor = telefone.replace(/\D/g, "");

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