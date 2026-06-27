import express from "express";
import connection from "./src/api/database/db.js";
import enviroments from "./src/api/config/enviroments.js";
import productRoutes from "./src/api/routes/product.routes.js";
import { loggerURL, } from "./src/api/middlewares/middlewares.js";
import cors from "cors";

const app = express();
const PORT = enviroments.port;


app.use(cors()); // Middleware basico para permitir todas las solicitudes

// Middleware para parsear JSON en las solcitudes POST y PUT
app.use(express.json()); // sin esto, recibe como undefined

app.use(loggerURL)

  /////////////////
 /// ENDPOINTS ///
/////////////////


app.get("/", (req, res) => {
    res.send("Hola mundo!");
});

app.use("/api/productos", productRoutes);

app.listen(3000, () => {
    console.log(`Servidor corriendo en el puerto 3000`);
});