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
                    <p class="nombre-item">${producto.nombre} - $${producto.precio.toLocaleString('es-AR')}</p>

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
async function procesarCompraFinal() {

    if (carrito.length === 0) {
        alert("El carrito está vacío. No hay nada que cobrar.");
        return;
    }

    const confirmacion = confirm("¿Confirmas la compra de todos los productos en Gamer Zone?");
    
    if (confirmacion) {
        try {
            // 1. Calculamos el total y obtenemos el nombre del cliente
            const totalVenta = carrito.reduce((acumulador, item) => acumulador + (item.precio * item.cantidad), 0);
            const nombreCliente = localStorage.getItem("nombre-cliente");

            const date = new Date();
            const fechaVenta = date.toISOString().slice(0, 19).replace('T', ' ');

            // 2. Preparamos el JSON para el backend
            // Asegúrate de que las claves coincidan con lo que espera tu controlador en req.body
            const datosVenta = {
                nombre_usuario: nombreCliente,
                fecha: fechaVenta,
                precio: totalVenta,
                items: carrito.map(producto => ({ 
                    id: producto.id, 
                    cantidad: producto.cantidad, 
                    precio: producto.precio 
                }))
            };

            // 3. Enviamos la petición POST a tu API
            const respuesta = await fetch("http://localhost:3000/api/ventas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datosVenta)
            });

            if (!respuesta.ok) {
                throw new Error("Error al guardar la venta en el servidor.");
            }

            // 4. Obtenemos la respuesta del backend (ej. el ID autoincremental de MySQL)
            const ventaGuardada = await respuesta.json();

            // 5. Armamos el objeto 'ultimo_pedido' usando el ID real de la base de datos
            // Si tu backend devuelve la variable con otro nombre (ej. insertId o idVenta), cámbialo aquí
            const ultimoPedido = {
                id: ventaGuardada.id_venta,
                items: carrito.map(item => ({ producto: item.nombre, cantidad: item.cantidad, precio: item.precio })),
                total: totalVenta
            };
            
            // 6. Guardamos los datos para que ticket.js los dibuje
            localStorage.setItem("ultimo_pedido", JSON.stringify(ultimoPedido));

            alert("🔥 ¡COMPRA EXITOSA! Redireccionando a tu comprobante...");
            
            // 7. Vaciamos la memoria y limpiamos el storage
            carrito = []; 
            localStorage.removeItem("carrito-productos"); 
            
            // 8. Finalmente, redirigimos
            window.location.href = "ticket.html";

        } catch (error) {
            console.error("Error procesando la compra:", error);
            alert("Ocurrió un error al procesar el pago o contactar al servidor. Intenta nuevamente.");
        }
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