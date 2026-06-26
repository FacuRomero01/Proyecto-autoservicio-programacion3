import express from "express";
import connection from "./scr/api/database/db.js";
import enviroments from "./scr/api/config/enviroments.js";
import cors from "cors";

const app = express();
const PORT = enviroments.port;


/////////////////
 // Middlewares //
/////////////////


app.use(cors()); // Middleware basico para permitir todas las solicitudes

// Middleware logger para analizar todas las solicitudes por consola (tener el historial del consumo de nuestra Api REST en la consola)
app.use((req, res, next) => {
    let fecha = new Date();
    console.log(`[${fecha.toLocaleDateString()} ${fecha.toLocaleTimeString()}] ${req.method} ${req.url}`);
    
    next(); // next() da paso a que continue la respuesta o el siguiente middleware (en caso de haberlo)
});

// Middleware para parsear JSON en las solcitudes POST y PUT
app.use(express.json()); // sin esto, recibe como undefined

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


  /////////////////
 /// ENDPOINTS ///
/////////////////


app.get("/", (req, res) => {
    res.send("Hola mundo!");
});

app.get("/api/productos", async (req,res) => {
    try {
        
/*
El método query de mysql2 no te devuelve solo los datos de la tabla;
te devuelve un array con dos cosas: [los_datos_de_la_tabla, la_meta_data_de_las_columnas].
Al poner [rows], le estás diciendo: "De ese par de cosas que me devolvés, 
guardame la primera (las filas de datos) en una variable llamada rows e ignorá la segunda".
*/

// Optimización 1: Destructuring usando [rows]
// Optimización 2: Sentencia SQL mas eficiente

        const sql = "SELECT id, nombre, imagen, precio, categoria, activo FROM productos"
        const [rows] = await connection.query(sql);

// Optimización 3: Respuesta en caso de no encontrar productos (404 = Not Found)

        if (rows.length === 0) {
            return res.status(404).json({
                message: "No se encontraron productos"
            });
        }
        
// Optimización 4: Metadata total agregada para poder ser consumida desde el front

        res.status(200).json({
            total: rows.length, 
            payload: rows,
        });

    } catch (error) {
        console.error("Error obteniendo productos: ", error.message);

        res.status(500).json({
            error: "Error Interno al obtener productos",
        });
    }
});


app.get("/api/productos/:id", validateId, async (req, res) => {

    try {
        // Optimización 1: Uso de Placeholders "?" para evitar SQL injection
        const sql = `SELECT id, nombre, imagen, precio, categoria, activo FROM productos where id = ?`;

        const [rows] = await connection.query(sql, [req.id]);

        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró un producto con id ${req.id}`
            });
        }

        res.status(200).json({
            payload: rows
        });
    } catch (error) {
        console.error(`Error obteniendo el producto con id ${id}`, error.message);
    
        res.status(500).json({
            error: "Error interno al obtener un producto por id"
        });
    }
});

app.post("/api/productos", validateProduct, async (req,res) => {
    try {
        const {id, nombre, imagen, categoria, precio, activo} = req.body;

        const cleanName = nombre.trim();

        let sql = "INSERT INTO productos (id, nombre, imagen, categoria, precio, activo) VALUES (?, ?, ?, ?, ?, ?)";

        const [rows] = await connection.query(sql, [id, cleanName, imagen, categoria, precio, 1]);

        res.status(201).json({
            message: `Producto creado con exito con id ${rows.insertId}`,
            productId: rows.insertId // Optimizacion 4: Devolvemos info util como el nuevo id creado
        });


    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Error interno del servidor al crear productos"
        })
    }
});

app.put("/api/productos", validateProduct, async (req,res) => {
    
    try {
        let {id, nombre, imagen, categoria, precio, activo} = req.body;

        let sql = `UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?`;

        const [result] = await connection.query(sql, [nombre, imagen, categoria, precio, activo, id]);

        if (result.changedRows === 0) {
            return res.status(404).json({
                message: `No se actualizo el producto`
            })
        }

        res.status(200).json({
            message: "Producto actualizado con éxito"
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Error interno del servidor al crear productos"
        });
    }
});

app.delete("/api/productos/:id", validateId, async (req, res) => {
    try {
        const sql = "DELETE FROM productos WHERE id = ?"
        await connection.query(sql, [req.id]);

        res.status(200).json({
            message: `Producto con id ${req.id} eliminado correctamente`
        });
    } catch (error) {
        console.log(error)

        res.status(500).json({
            message: "Error interno del servidor al eliminar productos"
        })
    }
});



app.listen(3000, () => {
    console.log(`Servidor corriendo en el puerto 3000`);
});