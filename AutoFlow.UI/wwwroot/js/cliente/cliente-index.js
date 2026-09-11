// Importando as funções direto da nossa pasta central de utilitários
import { formatarCPF, formatarTelefone } from '/js/utils/masks.js';

window.addEventListener("DOMContentLoaded", () => {
    // 1. Carregar a lista de clientes assim que a página abrir
    carregarClientes();

    // 2. Configurar o evento de clique no botão "Salvar Cliente" do Modal
    const btnSalvar = document.getElementById("btnSalvarCliente");
    if (btnSalvar) {
        btnSalvar.addEventListener("click", salvarCliente);
    }
});

// ==========================================
// FUNÇÃO DE CARREGAR CLIENTES (GET)
// ==========================================
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
                            <button class="btn btn-sm btn-salvar-modal-padrao" title="Editar"><i class="bi bi-pencil"></i></button>
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

// ==========================================
// FUNÇÃO DE CADASTRAR NOVO CLIENTE (POST)
// ==========================================
async function salvarCliente() {
    // Pega os valores digitados nos inputs do modal
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const documento = document.getElementById("documento").value;

    // Validação simples para garantir que o usuário preencheu os campos obrigatórios
    if (!nome || !telefone || !documento) {
        alert("Por favor, preencha todos os campos do formulário!");
        return;
    }

    // Monta o objeto que vai ser enviado para a C# API
    // (Importante: os nomes das propriedades devem bater com a sua classe Cliente.cs)
    const novoCliente = {
        nome: nome,
        telefoneWhatsApp: telefone,
        documento: documento
    };

    try {
        // Dispara a requisição POST para a API
        const resposta = await fetch('/api/clienteapi', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoCliente)
        });

        if (!resposta.ok) {
            throw new Error("Erro ao salvar o cliente na API.");
        }

        // Sucesso! Vamos limpar o formulário
        document.getElementById("formCliente").reset();

        // Fechar o modal do Bootstrap via código JavaScript
        const modalElement = document.getElementById('modalCliente');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        if (modalInstance) {
            modalInstance.hide();
        }

        // Recarrega a listagem de clientes para o novo ticket aparecer na hora!
        carregarClientes();

        // Feedback positivo leve para o usuário
        console.log("Cliente cadastrado com sucesso!");

    } catch (error) {
        console.error("Erro ao salvar:", error);
        alert("Não foi possível salvar o cliente. Verifique os dados e tente novamente.");
    }
}