/////////////////
 // Middlewares //
/////////////////



// Middleware logger para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
const loggerURL = (req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
};



const validateId = (req, res, next) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).json({
            error: "El ID debe ser un entero positivo"
        });
    }

    req.id = id;
    next();
}

// Middleware para validar los campos de un formulario
const categoriasValidas = ["juego", "consola"];
const validateProduct = (req, res, next) => {
    
    const {id, nombre, imagen, categoria, precio} = req.body;; // Recogemos los datos del body
    const errores = []; // Creamos un array vacio de errores

    // Verificamos los datos de entrada
    if (!nombre || !imagen || !categoria || !precio) {
        errores.push("Faltan campos requeridos");
    }

    if (typeof nombre !== "string" || nombre.trim().length < 2) {
        errores.push("El nombre debe tener al menos 2 caracteres");
    }

    // El precio lo parsearemos previamente en el cliente
    if (typeof precio !== "number" || precio <= 0) {
        errores.push("El precio debe ser un numero mayor a 0");
    }

    // No validaremos image porque luego usaremos Multer

    if (!categoriasValidas.includes(categoria)) {
        errores.push("Categoria invalida");
    }

    // Detectamos si existe algun error en la lista y lo devolvemos en un 400
    if (errores.length > 0) {
        return res.status(400).json({
            message: "Datos invalidos",
            listaErrores: errores
        });
    }

    next(); // Sin el next, no da paso al siguiente middleware o a procesar la respuesta
}

const requireLogin = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/login")
    }
    next();
}


export {
    loggerURL,
    validateId,
    validateProduct,
    requireLogin
}