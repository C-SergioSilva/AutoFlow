// ====================================================
// UTILITÁRIO GLOBAL DE PAGINAÇÃO GENÉRICA
// ====================================================

export function renderizarPaginacao(dadosPaginados, funcaoCallbackCarregar, objetoEstado, seletorAcimaDestinoId, seletorAbaixoDestinoId) {
    
    // 1. Pega o container de destino onde a paginação deve aparecer (informado pela tela)
    let paginacaoContainer = document.getElementById(seletorAcimaDestinoId);
    let paginacaoContainerQde = document.getElementById(seletorAbaixoDestinoId);

    if (!paginacaoContainerQde || !paginacaoContainer) {
        console.warn(`Um dos elementos de ID '${seletorAcimaDestinoId}' ou '${seletorAbaixoDestinoId}' não foi encontrado no HTML.`);
        return;
    }

    // 1. TOPO: Dividido entre Seletor à esquerda e Filtros à direita
    paginacaoContainer.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mt-3 mb-4 flex-wrap gap-3 w-100">
            <!-- Lado Esquerdo: Itens por página -->
            <div class="d-flex align-items-center gap-2">
                <span class="text-padrao-pages small">Itens por página:</span>
                <select id="selectQtdPorPagina" class="form-select form-select-sm btn-page-color-padrao w-auto">
                    <option value="5" ${objetoEstado.quantidadePorPagina === 5 ? 'selected' : ''}>5</option>
                    <option value="10" ${objetoEstado.quantidadePorPagina === 10 ? 'selected' : ''}>10</option>
                    <option value="20" ${objetoEstado.quantidadePorPagina === 20 ? 'selected' : ''}>20</option>
                    <option value="50" ${objetoEstado.quantidadePorPagina === 50 ? 'selected' : ''}>50</option>
                </select>
            </div>

            <!-- LADO DIREITO: Filtros de Pesquisa Combinados -->
            <div id="area-filtros-topo" class="d-flex align-items-center gap-2 flex-wrap">

                <!-- 1. Input de Pesquisa por Nome -->
                <div class="position-relative" style="width: 200px;">
                    <span class="position-absolute top-50 start-0 translate-middle-y ps-3 text-muted">
                        <i class="bi bi-search small"></i>
                    </span>
                    <input type="text" id="filtroNome" class="form-control form-control-sm ps-5 form-page-color-padrao" placeholder="Nome..." value="${objetoEstado.filtroNome || ''}">
                </div>

                <!-- 2. Seletor de Tipo de Documento -->
                <select id="filtroTipoDocumento" class="form-select form-select-sm btn-page-color-padrao w-auto">
                    <option value="" ${!objetoEstado.filtroTipoDocumento ? 'selected' : ''}>Tipo Doc...</option>
                    <option value="1" ${objetoEstado.filtroTipoDocumento === "1" ? 'selected' : ''}>CPF</option>
                    <option value="2" ${objetoEstado.filtroTipoDocumento === "2" ? 'selected' : ''}>CNPJ</option>
                </select>

                <!-- 3. Input de Número do Documento -->
                <div style="width: 160px;">
                    <input type="text" id="filtroDocumento" class="form-control form-control-sm form-page-color-padrao" placeholder="Nº documento" value="${objetoEstado.filtroValorDocumento || ''}" ${!objetoEstado.filtroTipoDocumento ? 'disabled' : ''}>
                </div>

                <!-- 4. Botão de Pesquisa Combinada -->
                <button id="btnExecutarPesquisa" class="btn btn-color-padrao shadow-sm" title="Pesquisar registros">
                    <i class="bi bi-search"></i> Pesquisar
                </button>

                <!-- 5. Botão Limpar Filtros -->
                <button id="btnLimparFiltros" class="btn btn-outline-secondary d-flex align-items-center gap-1" title="Limpar filtros e resetar listagem">
                    <i class="bi bi-x-circle"></i> Limpar
                </button>

            </div>

        </div>
    `;

    // Se não houver dados ou paginação inválida, limpa o rodapé
    if (!dadosPaginados || dadosPaginados.totalPages <= 0) {
        paginacaoContainerQde.innerHTML = "";
        return;
    }

    const { pageNumber, totalPages } = dadosPaginados;

    // 2. Desenha os elementos visuais de forma totalmente genérica
    paginacaoContainerQde.innerHTML = `
        <!-- BLOCO EMBAIXO A ESQUERDA: Seletor e Informação da Página -->

        <div class="d-flex align-items-center mt-3 gap-3 flex-wrap">

            <div class="text-padrao-pages small">
                Página <strong>${pageNumber}</strong> de <strong>${totalPages}</strong>
            </div>

            <!-- BLOCO DA DIREITA: Botões de Navegação -->
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item ${pageNumber === 1 ? 'disabled' : ''}">
                        <button class="page-link "  id="btnAnteriorGlobal" type="button">Anterior</button>
                    </li>
                    <li class="page-item ${pageNumber === totalPages ? 'disabled' : ''}">
                        <button class="page-link "  id="btnProximaGlobal" type="button">Próxima</button>
                    </li>
                </ul>
            </nav>
        </div>

        
    `;

    // 2. RODAPÉ: Página atual e botões de navegação (se não houver filtro ativo)
    if (objetoEstado.filtroAtivo) {
        paginacaoContainerQde.innerHTML = `<div class="text-muted small fst-italic">Exibindo resultados da pesquisa filtrada.</div>`;
    } else {
        paginacaoContainerQde.innerHTML = `
            <div class="d-flex align-items-center mt-3 gap-3 flex-wrap">
                <div class="text-padrao-pages small">
                    Página <strong>${pageNumber}</strong> de <strong>${totalPages}</strong>
                </div>
                <nav>
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item ${pageNumber === 1 ? 'disabled' : ''}">
                            <button class="page-link" id="btnAnteriorGlobal" type="button">Anterior</button>
                        </li>
                        <li class="page-item ${pageNumber === totalPages ? 'disabled' : ''}">
                            <button class="page-link" id="btnProximaGlobal" type="button">Próxima</button>
                        </li>
                    </ul>
                </nav>
            </div>
        `;
    }

    // Configura os eventos do seletor e botões...
    document.getElementById("selectQtdPorPagina").addEventListener("change", function (e) {
        objetoEstado.quantidadePorPagina = parseInt(e.target.value);
        objetoEstado.paginaAtual = 1;
        funcaoCallbackCarregar();
    });

    const btnAnterior = document.getElementById("btnAnteriorGlobal");
    if (btnAnterior && pageNumber > 1) {
        btnAnterior.addEventListener("click", () => {
            objetoEstado.paginaAtual--;
            funcaoCallbackCarregar();
        });
    }

    const btnProxima = document.getElementById("btnProximaGlobal");
    if (btnProxima && pageNumber < totalPages) {
        btnProxima.addEventListener("click", () => {
            objetoEstado.paginaAtual++;
            funcaoCallbackCarregar();
        });
    }

    // 3. Configura os ouvintes de eventos dos botões e do select
    // document.getElementById("selectQtdPorPagina").addEventListener("change", function (e) {
    //     objetoEstado.quantidadePorPagina = parseInt(e.target.value);
    //     objetoEstado.paginaAtual = 1;
    //     funcaoCallbackCarregar(); // Chama a função que a tela passou (ex: carregarClientes)
    // });

    // const btnAnterior = document.getElementById("btnAnteriorGlobal");
    // if (btnAnterior && pageNumber > 1) {
    //     btnAnterior.addEventListener("click", () => {
    //         objetoEstado.paginaAtual--;
    //         funcaoCallbackCarregar(); // Chama a função da tela
    //     });
    // }

    // const btnProxima = document.getElementById("btnProximaGlobal");
    // if (btnProxima && pageNumber < totalPages) {
    //     btnProxima.addEventListener("click", () => {
    //         objetoEstado.paginaAtual++;
    //         funcaoCallbackCarregar(); // Chama a função da tela
    //     });
    // }
}

// ====================================================
//              FIM DA FUNÇÃO
// ====================================================