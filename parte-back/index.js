import express from "express";
import connection from "./src/api/database/db.js";
import enviroments from "./src/api/config/enviroments.js";
import { authRoutes, productRoutes, viewRoutes } from "./src/api/routes/index.js";
import { loggerURL, } from "./src/api/middlewares/middlewares.js";
import cors from "cors";
import { __dirname, join } from "./src/api/utils/index.js";
import session from "express-session";


const app = express();
const { port, session_key } =enviroments;
const PORT = port;


app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));


app.use(cors()); // Middleware basico para permitir todas las solicitudes

// Middleware para parsear JSON en las solicitudes POST y PUT
app.use(express.json()); // sin esto, recibe como undefined

app.use(loggerURL)

app.use(express.static(join(__dirname, "src/public")));

// Middleware para parsear los datos nativos del <form> HTML
app.use(express.urlencoded({
        extended: true
    }));

app.use(session({
    secret: session_key, //firma cookies para evitar manipulacion
    resave: false,
    saveUninitialized: true
}));

app.get("/", (req, res) => {
    res.send("Hola mundo!");
});


// RUTAS
app.use("/api/productos", productRoutes);
app.use("/dashboard", viewRoutes);
app.use("/login", authRoutes);

app.listen(3000, () => {
    console.log(`Servidor corriendo en el puerto 3000`);
});