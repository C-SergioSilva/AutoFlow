
// Assim que a janela carregar, chamamos nossa função para buscar os dados
window.addEventListener("DOMContentLoaded", async () => {
    try {
        // Fazendo uma requisição GET para a nossa API
        // (Substitua 'clienteapi' pelo nome exato da rota da sua controladora de API)
        const resposta = await fetch('/api/clienteapi');

        if (!resposta.ok) {
            throw new Error("Erro ao buscar os dados da API.");
        }

        const clientes = await resposta.json();
        var doc = document;
        const tbody = doc.getElementById("tabela-clientes");

        // Limpa a tabela caso tenha algo
        tbody.innerHTML = "";

        // Percorre cada cliente que veio da API e cria uma linha na tabela
        clientes.forEach(cliente => {
            const tr = doc.createElement("tr");
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.telefoneWhatsApp}</td>
                <td>${cliente.documento}</td>
                            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error("Erro:", error);
        alert("Não foi possível carregar a lista de clientes.");
    }
});