import ProductModel from "../models/product.models.js";

// 1. OBTENER TODOS
export const getProducts = async (req, res) => {
    try {
        const [rows] = await ProductModel.selectAllproducts();

        if (rows.length === 0) {
            return res.status(404).json({ message: "No se encontraron productos" });
        }

        res.status(200).json({
            total: rows.length,
            payload: rows
        });
    } catch (error) {
        console.error("Error obteniendo productos: ", error.message);
        res.status(500).json({ error: "Error interno al obtener productos" });
    }
};

// 2. OBTENER UNO POR ID
export const getOneProduct = async (req, res) => {
    try {
        const [rows] = await ProductModel.selectProductById(req.id);

        if (rows.length === 0) {
            return res.status(404).json({ error: `No se encontró un producto con id ${req.id}` });
        }

        res.status(200).json({ payload: rows });
    } catch (error) {
        console.error(`Error obteniendo el producto`, error.message);
        res.status(500).json({ error: "Error interno al obtener el producto" });
    }
};

// 3. CREAR PRODUCTO
export const createProduct = async (req, res) => {
    try {
        const {id, nombre, imagen, categoria, precio, valido} = req.body;
        const cleanName = nombre.trim();

        const [rows] = await ProductModel.insertNewProduct(id, cleanName, imagen, categoria, precio, valido);

        res.status(201).json({
            message: `Producto creado con éxito con id ${rows.insertId}`,
            productId: rows.insertId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al crear producto" });
    }
};

// 4. ACTUALIZAR PRODUCTO
export const updateProduct = async (req, res) => {
    try {
        const { id, nombre, imagen, categoria, precio, activo } = req.body;

        const [result] = await ProductModel.updateProduct(nombre, imagen, categoria, precio, activo, id);

        if (result.changedRows === 0) {
            return res.status(404).json({ message: "No se actualizó el producto" });
        }

        res.status(200).json({ message: "Producto actualizado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al actualizar" });
    }
};

// 5. ELIMINAR PRODUCTO
export const deleteProduct = async (req, res) => {
    try {
        await ProductModel.deleteProduct(req.id);

        res.status(200).json({
            message: `Producto con id ${req.id} eliminado correctamente`
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error interno del servidor al eliminar" });
    }
};