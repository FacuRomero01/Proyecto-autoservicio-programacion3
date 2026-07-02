localStorage.getItem("tema-preferido")

function guardarNombreEIniciar() {
    const nombre = document.getElementById("nombre-cliente").value.trim();
    if (!nombre) {
        alert("Por favor, ingresá tu nombre antes de comenzar.");
        return;
    }
    localStorage.setItem("nombre-cliente", nombre);
    window.location.href = "productos.html";
}

const themeToggle = document.getElementById('theme-toggle');

themeToggle.addEventListener('click', () => {
    if (document.documentElement.getAttribute('data-theme') === 'light') {
        document.documentElement.removeAttribute('data-theme');
        themeToggle.innerText = '🌙 Modo Oscuro';
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        themeToggle.innerText = '☀️ Modo Claro';
    }
});