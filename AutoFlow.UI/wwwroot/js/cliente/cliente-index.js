// Importando as funções direto da nossa pasta central de utilitários
import { formatarDocumento, formatarTelefone, mascararDocumentoParcial } from '/js/utils/masks.js';
import { mostrarAlerta } from '/js/utils/toast.js';
import { renderizarPaginacao } from '/js/utils/paginacao.js';
import { validarCPF, validarCNPJ } from '../utils/validadores.js';

// ====================================================
// FUNÇÃO DE CARREGAR CLIENTES (GET)
// ====================================================

// Estado de paginação exclusivo desta tela

    const estadoPaginacao = {
        paginaAtual: 1,
        quantidadePorPagina: 10,
        filtroNome: "",
        filtroTipoDocumento: "", // "1" para CPF, "2" para CNPJ
        filtroValorDocumento: ""
    };

    window.addEventListener("DOMContentLoaded", () => {
        // 1. Carregar a lista de clientes assim que a página abrir
        carregarClientes();

        // 2. Configurar o evento de clique no botão "Salvar Cliente" do Modal
        const btnSalvar = document.getElementById("btnSalvarCliente");

        if (btnSalvar) {
            btnSalvar.addEventListener("click", salvarCliente);

        }

        // 3. Configurar a máscara em tempo real no input de documento (NOVO!)
        const inputDocumento = document.getElementById("documento");
        const selectTipoCliente = document.getElementById("tipoCliente");
        const inputTelefone = document.getElementById("telefone");
        if (inputDocumento) {
            inputDocumento.addEventListener("input", function (e) {

                let valor = e.target.value;
                let tipoAtual = selectTipoCliente ? selectTipoCliente.value : "1"; // Pega se é CPF (1) ou CNPJ (2)

                if (!tipoAtual) {
                    mostrarAlerta("Por favor, selecione primeiro o tipo de cliente CPF ou CNPJ!", "warning");
                    e.target.value = ""; // Limpa o campo para evitar dados perdidos
                    return;
                }

                // Chama a função de formatação que importamos lá em cima
                e.target.value = formatarDocumento(valor, tipoAtual);
            });
        }
        if (inputTelefone) {
            inputTelefone.addEventListener("input", function (e) {
                let valor = e.target.value;
                e.target.value = formatarTelefone(valor);
            });
        }
    });

// ====================================================
//                   FIM DA FUNÇÃO
// ====================================================



// ====================================================
// EVENTOS DOS FILTROS E MÁSCARAS NO TOPO
// ====================================================

// 1. Apenas aplica a máscara no input do documento enquanto digita (sem chamar a API!)
    document.addEventListener("input", function (e) {
        if (e.target && e.target.id === "filtroDocumento") {
            const input = e.target;
            let valor = input.value;
            let posicaoCursor = input.selectionStart;

            const selectTipoDoc = document.getElementById("filtroTipoDocumento");
            const tipoDoc = selectTipoDoc ? selectTipoDoc.value : "";

            if (!tipoDoc) return;

            // Aplica a máscara centralizada
            let valorFormatado = formatarDocumento(valor, tipoDoc);
            let diferencaTamanho = valorFormatado.length - valor.length;

            input.value = valorFormatado;

            let novaPosicao = posicaoCursor + diferencaTamanho;
            if (novaPosicao < 0) novaPosicao = 0;
            input.setSelectionRange(novaPosicao, novaPosicao);
        }
    });

    // 2. Controla a ativação/desativação do campo de documento ao mudar o select
    document.addEventListener("change", function (e) {
        if (e.target && e.target.id === "filtroTipoDocumento") {
            const tipoSelecionado = e.target.value;
            const inputDoc = document.getElementById("filtroDocumento");

            if (inputDoc) {
                if (tipoSelecionado) {
                    inputDoc.removeAttribute("disabled");
                    inputDoc.value = "";
                    inputDoc.placeholder = tipoSelecionado === "1" ? "000.000.000-00" : "00.000.000/0000-00";
                } else {
                    inputDoc.setAttribute("disabled", "true");
                    inputDoc.value = "";
                }
            }
        }
    });

    // 3. Dispara a pesquisa combinada ao clicar no botão "Pesquisar"
    document.addEventListener("click", function (e) {
        const btnPesquisar = e.target.closest("#btnExecutarPesquisa");
        if (!btnPesquisar) return;

        executarPesquisaCombinada();
    });

    // 4. Dispara a pesquisa combinada ao apertar "Enter" em qualquer campo de filtro
    document.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && (e.target.id === "filtroNome" || e.target.id === "filtroDocumento" || e.target.id === "filtroTipoDocumento")) {
            e.preventDefault();
            executarPesquisaCombinada();
        }
    });

// ====================================================
// FUNÇÃO CENTRALIZADA DE VALIDAÇÃO E PESQUISA COMBINADA
// ====================================================
function executarPesquisaCombinada() {
    const inputNome = document.getElementById("filtroNome");
    const selectTipoDoc = document.getElementById("filtroTipoDocumento");
    const inputDoc = document.getElementById("filtroDocumento");

    const nomeTexto = inputNome ? inputNome.value.trim() : "";
    const tipoDocValor = selectTipoDoc ? selectTipoDoc.value : "";
    const docValor = inputDoc ? inputDoc.value.trim() : "";

    // Validação da Regra de Ouro do Nome (se preenchido, mínimo de 3 caracteres)
    if (nomeTexto.length > 0 && nomeTexto.length < 3) {
        mostrarAlerta("O filtro por nome precisa ter pelo menos 3 caracteres!", "warning");
        inputNome.focus();
        return;
    }

    // Validação cruzada: Se escolheu o tipo de documento, precisa ter preenchido o número
    if (tipoDocValor && !docValor) {
        mostrarAlerta("Você selecionou o tipo de documento, digite o número correspondente!", "warning");
        if (inputDoc) inputDoc.focus();
        return;
    }

    // Atualiza o nosso objeto de estado global com TODOS os critérios preenchidos
    estadoPaginacao.filtroNome = nomeTexto;
    estadoPaginacao.filtroTipoDocumento = tipoDocValor;
    estadoPaginacao.filtroValorDocumento = docValor;
    estadoPaginacao.paginaAtual = 1; // Sempre volta para a primeira página ao filtrar

    // Dispara a busca unificada para a API
    carregarClientes();
}

// ========================================================================
// CARREGANDO CLIENTES COM PAGINAÇÃO, FILTROS E MÁSCARAS
//`/api/clienteapi/paginados?pagina=${estadoPaginacao.paginaAtual}&quantidade=${estadoPaginacao.quantidadePorPagina}`
// ========================================================================

    async function carregarClientes() {
            try {

                const url = `/api/clienteapi/paginados?pagina=${estadoPaginacao.paginaAtual}&quantidade=${estadoPaginacao.quantidadePorPagina}` +
                    `&nome=${encodeURIComponent(estadoPaginacao.filtroNome)}&tipoDocumento=${estadoPaginacao.filtroTipoDocumento}` +
                    `&documento=${encodeURIComponent(estadoPaginacao.filtroValorDocumento)}`;

                const resposta = await fetch(url);
       
                if (!resposta.ok) {
                    throw new Error("Erro ao buscar os dados da API.");
                }

                const resultadoPaginado = await resposta.json();
                const clientes = resultadoPaginado.items;
                const container = document.getElementById("container-clientes");
                container.innerHTML = "";

                // Validação se a lista estiver vazia
                if (!clientes || clientes.length === 0) {
                    container.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <div class="text-muted">
                                <i class="bi bi-folder2-open display-4 mb-3 d-block"></i>
                                <h5>Nenhum cliente cadastrado ainda.</h5>
                                <p class="small">Clique no botão "Novo Cliente" acima para começar a cadastrar.</p>
                            </div>
                        </div>
                    `;
                    return;
                }

                // Renderiza os tickets na tela
                clientes.forEach(cliente => {
                    console.log("Cliente recebido da API:", cliente);
                    const cardDiv = document.createElement("div");
                    cardDiv.className = "col-md-4 col-sm-6";

                    cardDiv.innerHTML = `
                        <div class="card border-0 shadow-sm h-100 border-start border-padrao-cards border-4">
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start mb-2">
                                    <h5 class="card-title fw-bold color-text-padrao mb-0">${cliente.nome}</h5>
                                    <span class="badge bg-light text-secondary d-none">#${cliente.id || '0'}</span>
                                </div>
                                <p class="card-text text-muted small mb-2">
                                    <i class="bi bi-whatsapp text-success me-1"></i> ${formatarTelefone(cliente.telefoneWhatsApp) || 'Não informado'}
                                </p>
                                <p class="card-text text-muted small mb-3">
                                   <i class="bi bi-card-text text-secondary me-1"></i> ${cliente.tipo} : ${mascararDocumentoParcial(cliente.documento) || 'Não informado'}
                                </p>
                                <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                             
                                <button class="btn btn-sm btn-salvar-modal-padrao btn-editar"
                                        title="Editar"
                                        data-id="${cliente.id}"
                                        data-nome="${cliente.nome}"
                                        data-telefone="${cliente.telefoneWhatsApp}"
                                        data-documento="${cliente.documento}"
                                        data-tipo="${cliente.tipo}">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                    <button class="btn btn-sm btn-outline-danger btn-excluir" 
                                        title="Excluir"
                                        data-id="${cliente.id}">
                                        <i class="bi bi-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

                    container.appendChild(cardDiv);
                });

                // 🌟 RENDERIZA A PAGUNAÇÃO AQUI:
                // Passamos os dados que vieram da API, a própria função carregarClientes e o estado atual!
                renderizarPaginacao(resultadoPaginado, carregarClientes, estadoPaginacao, "paginacao-container01", "paginacao-container02");

            } catch (error) {
                console.error("Erro detalhado:", error);
            }
        }

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================


// ====================================================
// FUNÇÃO DE CADASTRAR NOVO CLIENTE (POST)
// ====================================================

    async function salvarCliente() {

        // Pega os valores digitados nos inputs do modal
        const id = document.getElementById("clienteId");
        const nome = document.getElementById("nome");
        const telefone = document.getElementById("telefone");
        const documento = document.getElementById("documento");
        const tipoCliente = document.getElementById("tipoCliente");
        let documentoLimpo = document.getElementById("documentoOriginal"); // Limpa o documento para enviar apenas números

        let formValido = true;

        // 2. Validação individual de cada campo com destaque visual (.is-invalid)

        // Valida Nome
        if (!nome.value.trim()) {
            document.getElementById("nome").classList.add("is-invalid"); // Pinta de vermelho
            formValido = false;
        } else {
            nome.classList.remove("is-invalid"); // Remove o vermelho se preencheu
        }

        // Valida Telefone
        if (!telefone.value.trim()) {
            telefone.classList.add("is-invalid");
            formValido = false;
        } else {
            telefone.classList.remove("is-invalid");
        }

        // Valida Tipo de Cliente
        if (!tipoCliente.value) {
            tipoCliente.classList.add("is-invalid");
            formValido = false;
        } else {
            tipoCliente.classList.remove("is-invalid");
        }

        // Valida Documento (Preenchimento e Validação Matemática)
        if (!documento.value.trim()) {
            documento.classList.add("is-invalid");
            formValido = false;
        } else {
            // Se o documento contém asteriscos '*', significa que veio mascarado da listagem (Modo Edição)
            // Logo, não precisamos de revalidar a matemática dele na ponta do client-side, 
            // pois ele já está guardado de forma segura no banco de dados!
            if (documento.value.includes('*')) {
                documento.classList.remove("is-invalid");
            } else {
                // É um documento novo digitado pelo usuário do zero! Aplicamos a validação matemática:
                documentoLimpo = documento.value.replace(/\D/g, '');
                let documentoEhValido = true;
                const tipoValor = parseInt(tipoCliente.value);

                if (tipoValor === 1) {
                    documentoEhValido = validarCPF(documentoLimpo);
                } else if (tipoValor === 2) {
                    documentoEhValido = validarCNPJ(documento.value);
                }

                if (!documentoEhValido) {
                    documento.classList.add("is-invalid");
                    mostrarAlerta("Número de documento Inválido! Verifique e entre com o número que seja válido.", "erro");
                    return;
                } else {
                    documento.classList.remove("is-invalid");
                }
            }
        }

        // Se algum campo falhou na validação, paramos por aqui e avisamos
        if (!formValido) {
            mostrarAlerta("Por favor, preencha todos os campos destacados em vermelho!", "warning");
            return;
        }

        const clienteData = {
            Id: id.value ? parseInt(id.value) : 0,
            Nome: nome.value,
            TelefoneWhatsApp: telefone.value,
            Documento: id.value ? documentoLimpo.value : documento.value.replace(/[^0-9A-Za-z]/g, ''), // Se for edição, pega o valor limpo do input oculto; se for novo, limpa o input digitado
            Tipo: parseInt(tipoCliente.value)
        };

        try {
            // Dispara a requisição POST para a API
        
            const resposta = await fetch('/api/ClienteApi', {
                method: 'POST', // O POST cuida tanto de salvar quanto de atualizar na nossa Controller
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clienteData)
            });

            if (!resposta.ok) {
                throw new Error("Erro ao salvar o cliente na API.");
            }

            // Sucesso! Vamos limpar o formulário e o ID oculto
            document.getElementById("formCliente").reset();
            document.getElementById("clienteId").value = ""

            // Fechar o modal do Bootstrap via código JavaScript
            const modalElement = document.getElementById('modalCliente');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) modalInstance.hide();

            // Recarrega a listagem de clientes para o novo ticket aparecer na hora!
            carregarClientes();

            // Feedback positivo leve para o usuário
            mostrarAlerta("Cliente salvo com sucesso!", "sucesso");

        } catch (error) {
            console.error("Erro ao salvar:", error);
            mostrarAlerta("Não foi possível salvar o cliente. Verifique os dados e tente novamente.", "erro");
        }
    }

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================

// ====================================================
// FUNÇÃO PARA PREPARAR A EDIÇÃO DO CLIENTE
// ====================================================

    document.addEventListener("click", function (event) {

        // Verifica se o elemento clicado (ou o ícone dentro dele) é o botão de editar
        const btnEditar = event.target.closest(".btn-editar");
        const idCliente = document.getElementById("clienteId").value;
        if (!btnEditar && (!idCliente || idCliente === '' || idCliente === '0')) {
            // 🌟 Deixamos o Documento e o Tipo habilitados para o caso de ser um novo cadastro
            document.getElementById("documento").disabled = false;
            document.getElementById("tipoCliente").disabled = false;
        }
        if (!btnEditar) {
            return;
        }

        // Pega os dados guardados nos atributos data-* do botão
        const id = btnEditar.getAttribute("data-id");
        const nome = btnEditar.getAttribute("data-nome");
        const telefone = btnEditar.getAttribute("data-telefone");
        const documento = btnEditar.getAttribute("data-documento");
        const tipoRecebido = btnEditar.getAttribute("data-tipo");
        const selectTipoCliente = document.getElementById("tipoCliente");

        let tipoAtual = selectTipoCliente ? selectTipoCliente.value : "1"; // Pega se é CPF (1) ou CNPJ (2)

        // Mapeia o texto do C# para o valor numérico correspondente do nosso <select>
        let tipoValor = "1"; // padrão CPF
        if (tipoRecebido === "Cnpj" || tipoRecebido === "2") {
            tipoValor = "2";
        }

        // Joga os valores dentro dos inputs do modal
        document.getElementById("clienteId").value = id;
        document.getElementById("documentoOriginal").value = documento; // Guardamos o valor original do documento para referência futura
        document.getElementById("nome").value = nome;
        document.getElementById("telefone").value = formatarTelefone(telefone);
        document.getElementById("documento").value = mascararDocumentoParcial(documento, tipoValor);
        document.getElementById("tipoCliente").value = tipoValor;

        // 🌟 O PULO DO GATO PARA A EDIÇÃO: Deixamos o Documento e o Tipo em modo de leitura (desabilitados)
        document.getElementById("documento").disabled = true;
        document.getElementById("tipoCliente").disabled = true;

        // Altera o título do modal opcionalmente para dar feedback ao usuário
        const modalTitle = document.getElementById("modalClienteLabel");
        modalTitle.innerHTML = `<i class="bi bi-pencil-square me-2"></i> Editar Cliente`;

        // Altera o título do modal opcionalmente para dar feedback ao usuário
        const modelbtn = document.getElementById("btnSalvarCliente");
        modelbtn.innerHTML = ` Editar Cliente`;//btnSalvarCliente

        // Abre o modal do Bootstrap programaticamente
        const modalElement = document.getElementById('modalCliente');
        const modalInstance = new bootstrap.Modal(modalElement);
        modalInstance.show();
    });

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================


// ====================================================
// FUNÇÃO PARA ABRIR OU FECHAR MODAL
// ====================================================

    // Quando fechar ou abrir o modal para "Novo Cliente", limpa o ID e o título
    const modalClienteEl = document.getElementById('modalCliente');
    modalClienteEl.addEventListener('hidden.bs.modal', function () {
            document.getElementById("formCliente").reset();
            document.getElementById("clienteId").value = "";

            // Remove o destaque vermelho de todos os campos ao fechar o modal
            document.querySelectorAll("#formCliente .form-control, #formCliente .form-select").forEach(el => {
                el.classList.remove("is-invalid");
            });

            const modelbtn = document.getElementById("btnSalvarCliente");
            modelbtn.innerHTML = ` Salvar Cliente`;
            document.getElementById("modalClienteLabel").innerHTML = `<i class="bi bi-person-plus-fill me-2"></i> Cadastrar Novo Cliente`;
        });

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================

// ====================================================
// FUNÇÃO PARA EXCLUSÃO DE CLIENTE COM CONFIRMAÇÃO EM MODAL
// ====================================================

    // Variável global para guardar temporariamente o ID que será excluído
    let idClienteParaExcluir = null;

    // 1. Quando clicar na lixeira do card
    document.addEventListener("click", function (event) {

        const btnExcluir = event.target.closest(".btn-excluir");
        if (!btnExcluir) return;

        // Guarda o ID do cliente que está nesse card
        idClienteParaExcluir = btnExcluir.getAttribute("data-id");

        // Instancia e abre o modal do Bootstrap bonitinho
        const modalElement = document.getElementById('modalConfirmarExclusao');
        const modalBootstrap = new bootstrap.Modal(modalElement);
        modalBootstrap.show();
    });

    // 2. Quando clicar no botão de confirmação de dentro do modal
    document.getElementById("btnConfirmarExclusao").addEventListener("click", async function () {
        if (!idClienteParaExcluir) return;

        try {
            // Dispara o DELETE para a nossa API
            const resposta = await fetch(`/api/ClienteApi/${idClienteParaExcluir}`, {
                method: 'DELETE'
            });

            if (!resposta.ok) {
                throw new Error("Não foi possível excluir o cliente.");
            }

            // Fecha o modal de confirmação
            const modalElement = document.getElementById('modalConfirmarExclusao');
            const modalBootstrap = bootstrap.Modal.getInstance(modalElement);
            if (modalBootstrap) {
                modalBootstrap.hide();
            }

            // Dá o feedback de sucesso e atualiza a listagem
            mostrarAlerta("Cliente excluído com sucesso!", "sucesso");
            carregarClientes();

        } catch (error) {
            console.error("Erro ao excluir:", error);
            mostrarAlerta("Erro ao tentar excluir o cliente.", "erro");
        } finally {
            // Limpa a variável do ID
            idClienteParaExcluir = null;
        }
    });

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================


// ====================================================
// EVENTO: Botão "Limpar" os Filtros
// ====================================================
document.addEventListener("click", function (e) {
    const btnLimpar = e.target.closest("#btnLimparFiltros");
    if (!btnLimpar) return;

    // 1. Limpa os valores visuais dos inputs na tela
    const inputNome = document.getElementById("filtroNome");
    const selectTipoDoc = document.getElementById("filtroTipoDocumento");
    const inputDoc = document.getElementById("filtroDocumento");

    if (inputNome) inputNome.value = "";
    if (selectTipoDoc) selectTipoDoc.value = "";

    if (inputDoc) {
        inputDoc.value = "";
        inputDoc.setAttribute("disabled", "true"); // Bloqueia o campo de documento novamente
    }

    // 2. Reseta o estado global de paginação e filtros (mantendo apenas a quantidade por página escolhida!)
    estadoPaginacao.filtroNome = "";
    estadoPaginacao.filtroTipoDocumento = "";
    estadoPaginacao.filtroValorDocumento = "";
    estadoPaginacao.paginaAtual = 1; // Volta para a primeira página

    // 3. Recarrega a listagem completa da API
    carregarClientes();
});

// ====================================================
//                  FIM DA FUNÇÃO
// ====================================================