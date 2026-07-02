const URL_API = "http://localhost:3000/api/productos";
const contenedorProductos = document.getElementById("contenedor-productos");
let carrito = JSON.parse(localStorage.getItem("carrito-productos")) || [];

async function obtenerProductos() {
    try {
        const respuesta = await fetch(URL_API);
        
        if (!respuesta.ok) {
            throw new Error("No se pudo obtener el catálogo de juegos.");
        }

        const datos = await respuesta.json();
        
        todosLosProductos = datos.payload || datos; 
        
        renderizarProductos(todosLosProductos);

    } catch (error) {
        console.error("Error en Fetch:", error);
        contenedorProductos.innerHTML = `
            <div class="error-mensaje">
                <p> Error al conectar con el servidor de Gamer Zone.</p>
            </div>
        `;
    }
}


function renderizarProductos(listaProductos) {
    contenedorProductos.innerHTML = ""; 

    if (listaProductos.length === 0) {
        contenedorProductos.innerHTML = "<p>No hay productos disponibles por el momento.</p>";
        return;
    }

    listaProductos.forEach(prod => {
        if (prod.activo) {
            const tarjeta = document.createElement("div");
            tarjeta.className = "producto-card";

            const rutaImagen = `assets/img/${prod.imagen}`;

            tarjeta.innerHTML = `
                <img src="${prod.imagen}" alt="${prod.nombre}" class="producto-img">
                <div class="producto-info">
                    <h3>${prod.nombre}</h3>
                    <p class="categoria-tag">${prod.categoria}</p>
                    <p class="precio">$${prod.precio.toLocaleString('es-AR')}</p>
                    <button class="btn-agregar" onclick="agregarAlCarrito(${prod.id})">🎮 Agregar al Carrito</button>
                </div>
            `;
            contenedorProductos.appendChild(tarjeta);
        }
    });
}


function filtrarProductos(categoria) {
    if (categoria === 'TODOS') {
        renderizarProductos(todosLosProductos);
    } else {
        const filtrados = todosLosProductos.filter(p => p.categoria.toUpperCase() === categoria.toUpperCase());
        renderizarProductos(filtrados);
    }
}

function agregarAlCarrito(id) {
    const idNumero = Number(id);

    const producto = todosLosProductos.find(p => p.id === idNumero);
    if (!producto) return;
    
    const existeEnCarrito = carrito.find(item => item.id === idNumero);

    if (existeEnCarrito) {
        existeEnCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen,
            cantidad: 1
        });
    }

    sincronizarStorage();
    console.log("carrito:", carrito);
    alert(`🎮 ¡${producto.nombre} fue añadido a tu pedido!`);
}

function sincronizarStorage() {
    localStorage.setItem("carrito-productos", JSON.stringify(carrito));
}

document.addEventListener("DOMContentLoaded", obtenerProductos);