document.addEventListener("click", function (e) {
    // 1. Se clicar no botão/ícone de recolher/expandir o menu
    const btnToggle = e.target.closest("#btnToggleMenu");
    if (btnToggle) {
        document.body.classList.toggle("menu-recolhido");
        return;
    }

    // 2. Se o menu estiver recolhido e o usuário clicar em qualquer lugar DENTRO dele, ele expanda novamente
    const sidebar = e.target.closest("#sidebar");
    if (sidebar && document.body.classList.contains("menu-recolhido")) {
        document.body.classList.remove("menu-recolhido");
    }
});
