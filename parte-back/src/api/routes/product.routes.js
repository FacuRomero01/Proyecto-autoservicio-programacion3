import { Router } from "express";
import { validateId, validateProduct } from "../middlewares/middlewares.js";
import { getProducts, getOneProduct, createProduct, updateProduct, deleteProduct } from "../controllers/product.controllers.js";

const router = Router();

// 1. GET general
router.get("/", getProducts);

// 2. GET por ID (primero pasa por el validador de ID)
router.get("/:id", validateId, getOneProduct);

// 3. POST (primero pasa por el validador de producto)
router.post("/", validateProduct, createProduct);

// 4. PUT (pasa por el validador de producto)
router.put("/", validateProduct, updateProduct);

// 5. DELETE (pasa por el validador de ID)
router.delete("/:id", validateId, deleteProduct);

export default router;