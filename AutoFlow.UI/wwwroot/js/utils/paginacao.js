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

    if (!dadosPaginados || dadosPaginados.totalPages <= 0) {
        paginacaoContainerQde.innerHTML = "";
        paginacaoContainer.innerHTML = "";
        return;
    }

    const { pageNumber, totalPages } = dadosPaginados;


    // 2. Desenha os elementos visuais de forma totalmente genérica
    paginacaoContainer.innerHTML = `
        <!-- BLOCO DA ESQUERDA: Seletor e Informação da Página -->

        <div class="d-flex align-items-center mt-3 mb-4 gap-3 flex-wrap">
            <div class="d-flex align-items-center gap-2">
                <span class="text-padrao-pages small">Itens por página:</span>
                <select id="selectQtdPorPagina" class="form-select form-select-sm btn-page-color-padrao w-auto">
                    <option value="5" ${objetoEstado.quantidadePorPagina === 5 ? 'selected' : ''}>5</option>
                    <option value="10" ${objetoEstado.quantidadePorPagina === 10 ? 'selected' : ''}>10</option>
                    <option value="20" ${objetoEstado.quantidadePorPagina === 20 ? 'selected' : ''}>20</option>
                    <option value="50" ${objetoEstado.quantidadePorPagina === 50 ? 'selected' : ''}>50</option>
                </select>
            </div>        
    `;

    // 2. Desenha os elementos visuais de forma totalmente genérica
    paginacaoContainerQde.innerHTML = `
        <!-- BLOCO DA ESQUERDA: Seletor e Informação da Página -->

        <div class="d-flex align-items-center mt-3 gap-3 flex-wrap">

            <div class="text-muted small">
                Página <strong>${pageNumber}</strong> de <strong>${totalPages}</strong>
            </div>

            <!-- BLOCO DA DIREITA: Botões de Navegação -->
            <nav>
                <ul class="pagination pagination-sm mb-0">
                    <li class="page-item ${pageNumber === 1 ? 'disabled' : ''}">
                        <button class="page-link" btn-page-color-padrao id="btnAnteriorGlobal" type="button">Anterior</button>
                    </li>
                    <li class="page-item ${pageNumber === totalPages ? 'disabled' : ''}">
                        <button class="page-link" btn-page-color-padrao id="btnProximaGlobal" type="button">Próxima</button>
                    </li>
                </ul>
            </nav>
        </div>

        
    `;

    // 3. Configura os ouvintes de eventos dos botões e do select
    document.getElementById("selectQtdPorPagina").addEventListener("change", function (e) {
        objetoEstado.quantidadePorPagina = parseInt(e.target.value);
        objetoEstado.paginaAtual = 1;
        funcaoCallbackCarregar(); // Chama a função que a tela passou (ex: carregarClientes)
    });

    const btnAnterior = document.getElementById("btnAnteriorGlobal");
    if (btnAnterior && pageNumber > 1) {
        btnAnterior.addEventListener("click", () => {
            objetoEstado.paginaAtual--;
            funcaoCallbackCarregar(); // Chama a função da tela
        });
    }

    const btnProxima = document.getElementById("btnProximaGlobal");
    if (btnProxima && pageNumber < totalPages) {
        btnProxima.addEventListener("click", () => {
            objetoEstado.paginaAtual++;
            funcaoCallbackCarregar(); // Chama a função da tela
        });
    }
}