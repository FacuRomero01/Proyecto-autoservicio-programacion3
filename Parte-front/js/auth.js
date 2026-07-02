document.addEventListener("DOMContentLoaded", () => {
    const nombreGuardado = localStorage.getItem("nombre-cliente");

    // Si no existe el nombre, redirigir al inicio
    if (!nombreGuardado) {
        alert("Debes ingresar tu nombre para acceder a esta sección.");
        window.location.href = "index.html";
    }
});