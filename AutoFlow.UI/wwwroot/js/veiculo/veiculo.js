import { mostrarAlerta } from '/js/utils/toast.js';
import { renderizarPaginacao } from '/js/utils/paginacao.js';
import { escaparHtml } from '/js/utils/seguranca.js';

const API = '/api/VeiculoApi';

const estado = {
    paginaAtual: 1,
    quantidadePorPagina: 10,
    filtroPlaca: "",
    filtroModelo: ""
};

let idParaExcluir = null;
let temporizadorBusca = null;

const rotulosCombustivel = {
    NaoInformado: "Não informado", Flex: "Flex", Gasolina: "Gasolina", Etanol: "Etanol",
    Diesel: "Diesel", Gnv: "GNV", Eletrico: "Elétrico", Hibrido: "Híbrido"
};

// ====================================================
// APOIO
// ====================================================

// Toda chamada à API passa por aqui: se der erro, lê a mensagem (detail) que o servidor enviou
async function chamarApi(url, opcoes) {
    const resposta = await fetch(url, opcoes);

    if (!resposta.ok) {
        let mensagem = "Não foi possível concluir a operação.";
        try {
            const problema = await resposta.json();
            if (problema && problema.detail) mensagem = problema.detail;
        } catch { /* resposta sem corpo JSON: mantém a mensagem padrão */ }
        throw new Error(mensagem);
    }

    return resposta.status === 204 ? null : resposta.json();
}

function normalizarPlaca(texto) {
    return (texto || "").replace(/[^a-zA-Z0-9]/g, "").toUpperCase().substring(0, 7);
}

const $ = (id) => document.getElementById(id);

// ====================================================
// LISTAGEM
// ====================================================

function htmlFiltros() {
    return `
        <div class="d-flex align-items-center gap-2 flex-wrap">
            <div style="width: 150px;">
                <input type="text" id="filtroPlaca" class="form-control form-control-sm form-page-color-padrao text-uppercase"
                       maxlength="7" placeholder="Placa" value="${escaparHtml(estado.filtroPlaca)}">
            </div>
            <div style="width: 200px;">
                <input type="text" id="filtroModelo" class="form-control form-control-sm form-page-color-padrao"
                       placeholder="Marca ou modelo" value="${escaparHtml(estado.filtroModelo)}">
            </div>
            <button id="btnExecutarPesquisa" class="btn btn-color-padrao shadow-sm" title="Pesquisar">
                <i class="bi bi-search"></i> Pesquisar
            </button>
            <button id="btnLimparFiltros" class="btn btn-outline-secondary d-flex align-items-center gap-1" title="Limpar filtros">
                <i class="bi bi-x-circle"></i> Limpar
            </button>
        </div>`;
}

async function carregarVeiculos() {
    const container = $("container-veiculos");

    try {
        const parametros = new URLSearchParams({
            pagina: estado.paginaAtual,
            quantidade: estado.quantidadePorPagina,
            placa: estado.filtroPlaca,
            modelo: estado.filtroModelo
        });

        const resultado = await chamarApi(`${API}/paginados?${parametros}`);
        const veiculos = resultado.items;

        container.innerHTML = "";

        if (!veiculos || veiculos.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="text-muted">
                        <i class="bi bi-car-front display-4 mb-3 d-block"></i>
                        <h5>Nenhum veículo encontrado.</h5>
                        <p class="small">Clique em "Novo Veículo" para cadastrar.</p>
                    </div>
                </div>`;
        } else {
            veiculos.forEach(v => container.appendChild(criarCard(v)));
        }

        renderizarPaginacao(resultado, carregarVeiculos, estado, "paginacao-container01", "paginacao-container02", htmlFiltros());

    } catch (erro) {
        console.error("Erro ao carregar veículos:", erro);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="text-danger">
                    <i class="bi bi-exclamation-triangle display-4 mb-3 d-block"></i>
                    <h5>Ocorreu um erro ao carregar os veículos.</h5>
                    <p class="small text-muted">${escaparHtml(erro.message)}</p>
                </div>
            </div>`;
    }
}

function criarCard(v) {
    const col = document.createElement("div");
    col.className = "col-md-4 col-sm-6";

    const ano = v.anoModelo ? ` • ${escaparHtml(v.anoModelo)}` : "";
    const cor = v.cor ? ` • ${escaparHtml(v.cor)}` : "";
    const combustivel = rotulosCombustivel[v.combustivel] || v.combustivel;

    col.innerHTML = `
        <div class="card border-0 shadow-sm h-100 border-start border-padrao-cards border-4">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <h5 class="card-title fw-bold color-text-padrao mb-0">${escaparHtml(v.placa)}</h5>
                    <span class="badge bg-light text-secondary">${escaparHtml(combustivel)}</span>
                </div>
                <p class="card-text fw-semibold mb-1">${escaparHtml(v.marca)} ${escaparHtml(v.modelo)}</p>
                <p class="card-text text-muted small mb-2">${ano.replace(/^ • /, "")}${cor}</p>
                <p class="card-text text-muted small mb-1">
                    <i class="bi bi-speedometer2 me-1"></i> ${Number(v.quilometragem).toLocaleString("pt-BR")} km
                </p>
                <p class="card-text text-muted small mb-3">
                    <i class="bi bi-person-fill me-1"></i> ${escaparHtml(v.clienteNome)}
                </p>
                <div class="d-flex justify-content-end gap-2 pt-2 border-top">
                    <button class="btn btn-sm btn-salvar-modal-padrao btn-editar" title="Editar" data-id="${escaparHtml(v.id)}">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-danger btn-excluir" title="Excluir" data-id="${escaparHtml(v.id)}">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        </div>`;
    return col;
}

// ====================================================
// FILTROS (a barra é redesenhada a cada carga, por isso o ouvinte fica no document)
// ====================================================

function pesquisar() {
    const placa = normalizarPlaca($("filtroPlaca")?.value);
    const modelo = ($("filtroModelo")?.value || "").trim();

    if (placa && placa.length < 3) {
        mostrarAlerta("O filtro por placa precisa ter pelo menos 3 caracteres!", "warning");
        $("filtroPlaca").focus();
        return;
    }

    if (modelo && modelo.length < 3) {
        mostrarAlerta("O filtro por marca ou modelo precisa ter pelo menos 3 caracteres!", "warning");
        $("filtroModelo").focus();
        return;
    }

    estado.filtroPlaca = placa;
    estado.filtroModelo = modelo;
    estado.paginaAtual = 1;
    carregarVeiculos();
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#btnExecutarPesquisa")) pesquisar();

    if (e.target.closest("#btnLimparFiltros")) {
        estado.filtroPlaca = "";
        estado.filtroModelo = "";
        estado.paginaAtual = 1;
        carregarVeiculos();
    }
});

document.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && (e.target.id === "filtroPlaca" || e.target.id === "filtroModelo")) {
        e.preventDefault();
        pesquisar();
    }
});

document.addEventListener("input", (e) => {
    if (e.target.id === "filtroPlaca") e.target.value = normalizarPlaca(e.target.value);
});

// ====================================================
// MODAL: BUSCA DE CLIENTE (autocomplete)
// ====================================================

function selecionarCliente(id, nome) {
    $("clienteId").value = id;
    $("clienteBusca").value = nome;
    $("clienteBusca").classList.remove("is-invalid");
    $("listaClientes").classList.add("d-none");
}

async function buscarClientes(texto) {
    const lista = $("listaClientes");

    try {
        const parametros = new URLSearchParams({ nome: texto, quantidade: 5 });
        const resultado = await chamarApi(`/api/clienteapi/paginados?${parametros}`);

        lista.innerHTML = "";

        if (!resultado.items.length) {
            lista.innerHTML = `<div class="list-group-item text-muted small">Nenhum cliente encontrado.</div>`;
        } else {
            resultado.items.forEach(c => {
                const botao = document.createElement("button");
                botao.type = "button";
                botao.className = "list-group-item list-group-item-action";
                botao.textContent = c.nome;                       // textContent: nunca interpreta HTML
                botao.addEventListener("click", () => selecionarCliente(c.id, c.nome));
                lista.appendChild(botao);
            });
        }
        lista.classList.remove("d-none");

    } catch (erro) {
        console.error("Erro ao buscar clientes:", erro);
    }
}

$("clienteBusca").addEventListener("input", (e) => {
    $("clienteId").value = "";                                    // digitou de novo: seleção anterior invalida
    clearTimeout(temporizadorBusca);

    const texto = e.target.value.trim();
    if (texto.length < 3) {
        $("listaClientes").classList.add("d-none");
        return;
    }
    temporizadorBusca = setTimeout(() => buscarClientes(texto), 300);   // espera 300 ms sem digitar
});

// ====================================================
// MODAL: CAMPOS E SALVAR
// ====================================================

$("placa").addEventListener("input", (e) => { e.target.value = normalizarPlaca(e.target.value); });
$("chassi").addEventListener("input", (e) => { e.target.value = e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase(); });

function marcarInvalido(campo, invalido) {
    campo.classList.toggle("is-invalid", invalido);
    return !invalido;
}

function formularioValido() {
    let ok = true;
    ok = marcarInvalido($("clienteBusca"), !$("clienteId").value) && ok;
    ok = marcarInvalido($("placa"), !/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test($("placa").value)) && ok;
    ok = marcarInvalido($("marca"), !$("marca").value.trim()) && ok;
    ok = marcarInvalido($("modelo"), !$("modelo").value.trim()) && ok;
    return ok;
}

async function salvarVeiculo() {
    if (!formularioValido()) {
        mostrarAlerta("Preencha os campos destacados em vermelho.", "warning");
        return;
    }

    const id = $("veiculoId").value;

    const dados = {
        placa: $("placa").value,
        chassi: $("chassi").value || null,
        marca: $("marca").value.trim(),
        modelo: $("modelo").value.trim(),
        anoModelo: $("anoModelo").value ? parseInt($("anoModelo").value) : null,
        cor: $("cor").value.trim() || null,
        combustivel: $("combustivel").value,
        quilometragem: $("quilometragem").value ? parseInt($("quilometragem").value) : 0,
        clienteId: parseInt($("clienteId").value)
    };

    try {
        await chamarApi(id ? `${API}/${id}` : API, {
            method: id ? "PUT" : "POST",                          // PUT edita, POST cria
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dados)
        });

        bootstrap.Modal.getInstance($("modalVeiculo"))?.hide();
        mostrarAlerta("Veículo salvo com sucesso!", "sucesso");
        carregarVeiculos();

    } catch (erro) {
        mostrarAlerta(erro.message, "erro");                      // mostra o "detail" enviado pelo servidor
    }
}

$("btnSalvarVeiculo").addEventListener("click", salvarVeiculo);

// Ao fechar o modal: limpa tudo para o próximo uso
$("modalVeiculo").addEventListener("hidden.bs.modal", () => {
    $("formVeiculo").reset();
    $("veiculoId").value = "";
    $("clienteId").value = "";
    $("listaClientes").classList.add("d-none");
    document.querySelectorAll("#formVeiculo .is-invalid").forEach(el => el.classList.remove("is-invalid"));
    $("modalVeiculoLabel").innerHTML = `<i class="bi bi-car-front-fill me-2"></i> Cadastrar Novo Veículo`;
});

// ====================================================
// EDITAR E EXCLUIR (um ouvinte só para todos os cards)
// ====================================================

$("container-veiculos").addEventListener("click", async (e) => {

    const botaoEditar = e.target.closest(".btn-editar");
    if (botaoEditar) {
        try {
            const v = await chamarApi(`${API}/${botaoEditar.dataset.id}`);

            $("veiculoId").value = v.id;
            $("clienteId").value = v.clienteId;
            $("clienteBusca").value = v.clienteNome;
            $("placa").value = v.placa;
            $("chassi").value = v.chassi || "";
            $("marca").value = v.marca;
            $("modelo").value = v.modelo;
            $("anoModelo").value = v.anoModelo ?? "";
            $("cor").value = v.cor || "";
            $("combustivel").value = v.combustivel;
            $("quilometragem").value = v.quilometragem;

            $("modalVeiculoLabel").innerHTML = `<i class="bi bi-pencil-square me-2"></i> Editar Veículo`;
            new bootstrap.Modal($("modalVeiculo")).show();

        } catch (erro) {
            mostrarAlerta(erro.message, "erro");
        }
        return;
    }

    const botaoExcluir = e.target.closest(".btn-excluir");
    if (botaoExcluir) {
        idParaExcluir = botaoExcluir.dataset.id;
        new bootstrap.Modal($("modalConfirmarExclusao")).show();
    }
});

$("btnConfirmarExclusao").addEventListener("click", async () => {
    if (!idParaExcluir) return;

    try {
        await chamarApi(`${API}/${idParaExcluir}`, { method: "DELETE" });
        bootstrap.Modal.getInstance($("modalConfirmarExclusao"))?.hide();
        mostrarAlerta("Veículo excluído com sucesso!", "sucesso");
        carregarVeiculos();
    } catch (erro) {
        mostrarAlerta(erro.message, "erro");
    } finally {
        idParaExcluir = null;
    }
});

// ====================================================
// INÍCIO
// ====================================================
carregarVeiculos();