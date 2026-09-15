// Importando as funções direto da nossa pasta central de utilitários
import { formatarCPF, formatarTelefone } from '/js/utils/masks.js';
import { mostrarAlerta } from '/js/utils/toast.js';


window.addEventListener("DOMContentLoaded", () => {
    // 1. Carregar a lista de clientes assim que a página abrir
    carregarClientes();

    // 2. Configurar o evento de clique no botão "Salvar Cliente" do Modal
    const btnSalvar = document.getElementById("btnSalvarCliente");

    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarCliente);

    }
});

// ====================================================
// FUNÇÃO DE CARREGAR CLIENTES (GET)
// ====================================================
async function carregarClientes() {
    try {
        const resposta = await fetch('/api/clienteapi');

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados da API.");
        }

        const clientes = await resposta.json();
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
                           <i class="bi bi-card-text text-secondary me-1"></i> ${cliente.tipo} : ${formatarCPF(cliente.documento) || 'Não informado'}
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

                            <button class="btn btn-sm btn-outline-danger" title="Excluir"><i class="bi bi-trash"></i></button>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(cardDiv);
        });

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
    const id = document.getElementById("clienteId").value;
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const documento = document.getElementById("documento").value;
    const tipoCliente = document.getElementById("tipoCliente").value;

    // Validação simples para garantir que o usuário preencheu os campos obrigatórios
    if (!nome || !telefone || !documento || !tipoCliente) {
        mostrarAlerta("Por favor, preencha todos os campos do formulário!", "warning");
        return;
    }

    // Monta o objeto. Se o 'id' existir, mandamos ele maior que 0 para a API atualizar!
    // (Importante: os nomes das propriedades devem bater com a sua classe Cliente.cs)

    const clienteData = {
        Id: id ? parseInt(id) : 0,
        Nome: nome,
        TelefoneWhatsApp: telefone,
        Documento: documento,
        Tipo: parseInt(tipoCliente)
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
    if (!btnEditar) return;

    // Pega os dados guardados nos atributos data-* do botão
    const id = btnEditar.getAttribute("data-id");
    const nome = btnEditar.getAttribute("data-nome");
    const telefone = btnEditar.getAttribute("data-telefone");
    const documento = btnEditar.getAttribute("data-documento");
    const tipoRecebido = btnEditar.getAttribute("data-tipo");

    // Mapeia o texto do C# para o valor numérico correspondente do nosso <select>
    let tipoValor = "1"; // padrão CPF
    if (tipoRecebido === "Cnpj" || tipoRecebido === "2") {
        tipoValor = "2";
    }

    // Joga os valores dentro dos inputs do modal
    document.getElementById("clienteId").value = id;
    document.getElementById("nome").value = nome;
    document.getElementById("telefone").value = telefone;
    document.getElementById("documento").value = documento;
    document.getElementById("tipoCliente").value = tipoValor;

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

// Quando fechar ou abrir o modal para "Novo Cliente", limpa o ID e o título
const modalClienteEl = document.getElementById('modalCliente');
modalClienteEl.addEventListener('hidden.bs.modal', function () {
    document.getElementById("formCliente").reset();
    document.getElementById("clienteId").value = "";
    const modelbtn = document.getElementById("btnSalvarCliente");
    modelbtn.innerHTML = ` Salvar Cliente`;
    document.getElementById("modalClienteLabel").innerHTML = `<i class="bi bi-person-plus-fill me-2"></i> Cadastrar Novo Cliente`;
});

// ====================================================
//                  FIM DA FUNÇÃO 
// ====================================================
