document.addEventListener("DOMContentLoaded", () => {
    cargarTicket();
    
    // Escuchador del botón de PDF
    const btnPdf = document.getElementById("btn-descargar-pdf");
    if (btnPdf) {
        btnPdf.addEventListener("click", generarPDF);
    }
});

// ==========================================
// 1. CARGAR LOS DATOS EN EL HTML
// ==========================================
function cargarTicket() {
    // Traemos los datos de la memoria
    const pedidoString = localStorage.getItem("ultimo_pedido");
    const nombreCliente = localStorage.getItem("nombre-cliente")

    // Convertimos el texto JSON a un objeto de JavaScript
    const pedido = JSON.parse(pedidoString);

    // Llenamos la cabecera
    document.getElementById("ticket-cliente").textContent = nombreCliente;
    
    // Formateamos el ID para que tenga ceros adelante 
    const idFormateado = pedido.id ? pedido.id.toString().padStart(3, '0') : "000";
    document.getElementById("ticket-id").textContent = `#${idFormateado}`;

    // Ponemos la fecha y hora de Argentina
    const fechaActual = new Date().toLocaleString("es-AR");
    document.getElementById("ticket-fecha").textContent = `FECHA: ${fechaActual}`;

    // Llenamos el detalle de los items
    const detalleContenedor = document.getElementById("ticket-detalle");
    detalleContenedor.innerHTML = ""; // Limpiamos por si había algo

    pedido.items.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        const div = document.createElement("div");
        div.style.display = "flex";
        div.style.justifyContent = "space-between";
        div.style.marginBottom = "8px";
        
        div.innerHTML = `
            <span>${item.cantidad}x ${item.producto}</span>
            <span>$${subtotal.toLocaleString("es-AR")}</span>
        `;
        detalleContenedor.appendChild(div);
    });

    // Agregamos el Total
    const totalDiv = document.createElement("div");
    totalDiv.style.display = "flex";
    totalDiv.style.justifyContent = "space-between";
    totalDiv.style.marginTop = "20px";
    totalDiv.style.fontWeight = "bold";
    totalDiv.style.fontSize = "1.2rem";
    totalDiv.innerHTML = `
        <span>TOTAL:</span>
        <span>$${pedido.total.toLocaleString("es-AR")}</span>
    `;
    detalleContenedor.appendChild(totalDiv);
}

// ==========================================
// 2. GENERAR Y DESCARGAR EL PDF (jsPDF)
// ==========================================
function generarPDF() {
    const pedidoString = localStorage.getItem("ultimo_pedido");
    const nombreCliente = localStorage.getItem("nombre-cliente") || "Invitado";
    
    if (!pedidoString) return;

    const pedido = JSON.parse(pedidoString);
    const { jsPDF } = window.jspdf; // Traemos la librería que pusiste en el HTML
    const doc = new jsPDF(); // Creamos un lienzo en blanco

    const idFormateado = pedido.id ? pedido.id.toString().padStart(3, '0') : "000";
    const fechaActual = new Date().toLocaleString("es-AR");

    // Diseñando el PDF (Posiciones X, Y)
    doc.setFontSize(22);
    doc.text("MATANZA GAMING", 105, 20, null, null, "center");
    
    doc.setFontSize(12);
    doc.text("Comprobante de Pago", 105, 30, null, null, "center");
    
    doc.setFontSize(11);
    doc.text(`Cliente: ${nombreCliente}`, 20, 50);
    doc.text(`Pedido Nro: #${idFormateado}`, 20, 60);
    doc.text(`Fecha: ${fechaActual}`, 20, 70);

    doc.line(20, 75, 190, 75); // Línea separadora

    doc.setFontSize(14);
    doc.text("Detalle de la Compra", 20, 85);
    
    doc.setFontSize(11);
    let posicionY = 95;
    
    pedido.items.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        doc.text(`${item.cantidad}x ${item.producto}`, 20, posicionY);
        doc.text(`$${subtotal.toLocaleString("es-AR")}`, 170, posicionY);
        posicionY += 10;
    });

    doc.line(20, posicionY, 190, posicionY); // Línea separadora
    posicionY += 10;

    doc.setFontSize(14);
    doc.text("TOTAL:", 20, posicionY);
    doc.text(`$${pedido.total.toLocaleString("es-AR")}`, 170, posicionY);

    doc.setFontSize(10);
    doc.text("¡Que disfrutes tus juegos!", 105, posicionY + 25, null, null, "center");
    doc.text("The cake is a lie", 105, posicionY + 45, null, null, "center");

    // Le damos la orden de descargar el archivo con el número de pedido en el nombre
    doc.save(`Ticket_MatanzaGaming_${idFormateado}.pdf`);
}

// ==========================================
// 3. LIMPIAR LA SESIÓN AL SALIR
// ==========================================
// Esta función ya está enlazada al onclick="limpiarPedido()" de tu HTML
function limpiarPedido() {
    const temaGuardado = localStorage.getItem("tema-preferido"); 

    // 2. Borramos TODO el localStorage (pedidos, carritos viejos, nombres, etc.)
    localStorage.clear();

    // 3. Si el usuario tenía un tema guardado, se lo devolvemos
    if (temaGuardado !== null) {
        localStorage.setItem("tema-preferido", temaGuardado);
    }
}