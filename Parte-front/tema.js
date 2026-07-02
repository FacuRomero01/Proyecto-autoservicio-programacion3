// Aplicación inmediata del tema para evitar parpadeos
let temaGuardado = localStorage.getItem("tema-preferido");
if (temaGuardado === null) {
    temaGuardado = "dark"; 
    localStorage.setItem("tema-preferido", temaGuardado);
}

if (temaGuardado === "light") {
    document.documentElement.setAttribute("data-theme", "light");
} else {
    document.documentElement.removeAttribute("data-theme");
}

// Función para inicializar el botón cuando el DOM esté listo
function iniciarBotonTema() {
    const botonTema = document.getElementById("theme-toggle");

    if (botonTema) {
        // Establecer texto inicial
        botonTema.innerText = localStorage.getItem("tema-preferido") === "light" ? "🌙 Modo Oscuro" : "☀️ Modo Claro";

        // Limpiar listeners previos por si acaso
        botonTema.replaceWith(botonTema.cloneNode(true));
        const btnNuevo = document.getElementById("theme-toggle");

        btnNuevo.addEventListener("click", () => {
            const esLight = document.documentElement.getAttribute("data-theme") === "light";

            if (esLight) {
                document.documentElement.removeAttribute("data-theme");
                localStorage.setItem("tema-preferido", "dark");
                btnNuevo.innerText = "☀️ Modo Claro";
            } else {
                document.documentElement.setAttribute("data-theme", "light");
                localStorage.setItem("tema-preferido", "light");
                btnNuevo.innerText = "🌙 Modo Oscuro";
            }
        });
    }
}

// Intentar iniciar el botón
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarBotonTema);
} else {
    iniciarBotonTema();
}