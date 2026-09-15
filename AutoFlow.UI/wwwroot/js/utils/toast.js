// Função unificada para disparar feedbacks visuais padronizados
export function mostrarAlerta(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    // Define as cores e ícones do Bootstrap baseados no tipo da mensagem
    let bgClass = 'bg-success';
    let iconClass = 'bi-check-circle-fill';
    let titulo = 'Sucesso!';

    if (tipo === 'erro') {
        bgClass = 'bg-danger';
        iconClass = 'bi-exclamation-triangle-fill';
        titulo = 'Atenção!';
    } else if (tipo === 'warning') {
        bgClass = 'bg-warning text-dark';
        iconClass = 'bi-exclamation-circle-fill';
        titulo = 'Aviso!';
    }

    // Cria o elemento visual do alerta (Bootstrap Toast)
    const toastId = 'toast-' + Date.now();
    const toastHtml = `
        <div id="${toastId}" class="toast align-items-center text-white ${bgClass} border-0 shadow mb-2" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body fw-semibold">
                    <i class="bi ${iconClass} me-2"></i><strong>${titulo}</strong> ${mensagem}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    `;

    // Adiciona o toast no container da tela
    container.insertAdjacentHTML('beforeend', toastHtml);

    // Inicializa e exibe o toast usando o JavaScript do Bootstrap 5
    const toastElement = document.getElementById(toastId);
    const bsToast = new bootstrap.Toast(toastElement, { delay: 4000 }); // some sozinho após 4 segundos
    bsToast.show();

    // Remove o elemento do DOM depois que ele desaparece para não pesar a página
    toastElement.addEventListener('hidden.bs.toast', () => {
        toastElement.remove();
    });
}