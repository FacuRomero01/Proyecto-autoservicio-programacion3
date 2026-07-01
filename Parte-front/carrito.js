

let carrito = JSON.parse(localStorage.getItem("carrito-productos")) || [];

// 1. LEER DEL LOCALSTORAGE Y DIBUJAR
function mostrarCarrito() {
    const contenedorCarrito = document.getElementById("pantalla-carrito-items");

    contenedorCarrito.innerHTML = "";

    let PrecioTotal = 0

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <p>No hay productos en el carrito</p>
        `;

    } else {
        carrito.forEach((producto, indice) => {

            PrecioTotal += (producto.precio * producto.cantidad)
            contenedorCarrito.innerHTML += `
                <li class="bloque-item">
                    <img class="imagen-item" src="${producto.imagen}" alt="${producto.nombre}>
                    <p class="nombre-item">${producto.nombre} - ${producto.precio}</p>

                    <div class="botones-cantidad"> 
                        <button onclick="cambiarCantidad(${indice}, -1)"> - </button>
                        <span> ${producto.cantidad}</span>
                        <button onclick="cambiarCantidad(${indice}, 1)"> + </button>
                    </div>
                    
                    <button class="boton-eliminar" onclick="eliminarProducto(${indice})">Eliminar</button>
                </li>
            `;
        });
    }

    document.getElementById("cart-total-txt").textContent = `$${PrecioTotal}`;;

    sincronizarStorage();
}

// 2. FUNCIÓN PARA BORRAR UN ÍTEM INDIVIDUAL
function eliminarProducto(indice) {
    carrito.splice(indice, 1);

    mostrarCarrito();
}

// 3. BOTÓN DE COMPRA FINAL (GENERAR TICKET)
function procesarCompraFinal() {

    if (carrito.length === 0) {
        alert("❌ El carrito está vacío. No hay nada que cobrar.");
        return;
    }

    const confirmacion = confirm("¿Confirmas la compra de todos los productos en Gamer Zone?");
    
    if (confirmacion) {
        // Acá podrías hacer un fetch() con método POST a un futuro endpoint /api/ventas
        alert("🔥 ¡COMPRA EXITOSA! Gracias por confiar en Gamer Zone.\n\nTu ticket fue generado y enviado a tu consola.");
        
        carrito = [];
        localStorage.removeItem("carrito-productos"); // Vaciamos la memoria
        localStorage.removeItem("nombre-cliente")
        mostrarCarrito(); // Limpiamos pantalla
        window.location.href = "index.html"
    }
}

function cambiarCantidad(indice, cambio) {
    carrito[indice].cantidad += cambio;
    
    if (carrito[indice].cantidad === 0) {
        eliminarProducto(indice);
    } else {
        mostrarCarrito();
    }
}

function sincronizarStorage() {
    localStorage.setItem("carrito-productos", JSON.stringify(carrito));
}

// Apenas carga el HTML, ejecutamos el dibujado
document.addEventListener("DOMContentLoaded", mostrarCarrito);