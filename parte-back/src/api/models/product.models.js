import connection from "../database/db.js"

/////////////////////////////////
// Traer todos los productos
const selectAllproducts = () => {
    // Optimizacion 3: Sacamos * para evitar traer columnas innecesarias -> Mas eficiente en memoria y peticion de red. Ademas separamos la sentencia en una variable
    const sql = "SELECT id, nombre, imagen, precio, categoria, activo FROM productos";
    return connection.query(sql);
}



/////////////////////////////////
// Traer producto por id
const selectProductById = (id) => {
    // Optimizacion 4: Guardamos la consulta sql en una variable y la optimizamos pidiendo solo los campos requereidos
    const sql = "SELECT id, nombre, imagen, precio, categoria, activo FROM productos where id = ?";
    return connection.query(sql, [id]);
}



/////////////////////////////////
// Crear producto
const insertNewProduct = (id, nombre, imagen, categoria, precio, activo) => {
    const sql = "INSERT INTO productos (id, nombre, imagen, categoria, precio, activo) VALUES (?, ?, ?, ?, ?, ?)";
    
    // Optimizacion 3: Devolvemos la respuesta en un rows para devolver info util como el id asignado al nuevo producto
    return connection.query(sql, [id, nombre, imagen, categoria, precio, 1]);
}



/////////////////////////////////
// Modificar producto
const updateProduct = (nombre, imagen, categoria, precio, activo, id) => {
    const sql = "UPDATE productos SET nombre = ?, imagen = ?, categoria = ?, precio = ?, activo = ? WHERE id = ?";
    
    // Guardamos el resultado de la conexion que nos bridara info para la optimziacion
    return connection.query(sql, [nombre, imagen, categoria,  precio, activo, id]);
}



/////////////////////////////////
// Eliminar producto
const deleteProduct = (id) => {
    const sql = "DELETE FROM productos WHERE id = ?";

    return connection.query(sql, [id]);
}


export default {
    selectAllproducts,
    selectProductById,
    insertNewProduct,
    updateProduct,
    deleteProduct
}