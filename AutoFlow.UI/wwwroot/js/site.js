// document.addEventListener("click", function (e) {
//     // 1. Se clicar no botão/ícone de recolher/expandir o menu
//     const btnToggle = e.target.closest("#btnToggleMenu");
//     if (btnToggle) {
//         document.body.classList.toggle("menu-recolhido");
//         return;
//     }

//     // 2. Se o menu estiver recolhido e o usuário clicar em qualquer lugar DENTRO dele, ele expanda novamente
//     const sidebar = e.target.closest("#sidebar");
//     if (sidebar && document.body.classList.contains("menu-recolhido")) {
//         document.body.classList.remove("menu-recolhido");
//     }
// });

document.addEventListener("click", function (e) {
    const btnToggle = e.target.closest("#btnToggleMenu");
    if (btnToggle) {
        // Alterna o estado recolhido
        const isRecolhido = document.body.classList.toggle("menu-recolhido");

        // 🌟 O PULULO DO GATO: Se acabou de recolher, adicionamos uma classe que trava o hover 
        // até o mouse realmente sair de cima da barra lateral pela primeira vez!
        const sidebar = document.getElementById("sidebar");
        if (isRecolhido) {
            sidebar.classList.add("travar-hover");
        }

        btnToggle.blur();
    }
});

// Remove o travamento do hover assim que o mouse sai da barra lateral
document.addEventListener("mouseout", function (e) {
    const sidebar = document.getElementById("sidebar");
    if (sidebar && sidebar.contains(e.target)) {
        // Se o mouse saiu de dentro do sidebar, removemos a trava
        sidebar.classList.remove("travar-hover");
    }
});
