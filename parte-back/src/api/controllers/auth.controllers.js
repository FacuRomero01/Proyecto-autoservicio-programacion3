import userModels from "../models/user.models.js";

export const loginView = (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introduce tus credenciales",
        archivoCss: "/css/login.css"
    })
}

export const getAdminUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introduce tus credenciales",
                archivoCss: "/css/login.css",
                error: "Todos los campos son obligatorios"
            });
        }
        
        const [rows] = await userModels(email, password);

        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introduce tus credenciales",
                archivoCss: "/css/login.css",
                error: "Credenciales incorrectas"
            });
        }

        const user = rows[0];
        console.table(user);

        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email,
            esAdmin: user.es_admin
        }
        if (user.es_admin) {
            res.redirect("/dashboard/index");
        } else {
            return res.render("login", {
                title: "Login",
                about: "Introduce tus credenciales",
                archivoCss: "/css/login.css",
                error: "No tienes permisos de administrador para acceder"
            });
        }

    } catch (error) {
        console.log(error)
    }
}

export const destroyLogin = (req, res) => {
    req.session.destroy((error) => {
        if(error) {
            console.log("Error al destruir la sesión: ", error);

            return res.status(500).json({
                message: "Error al cerrar la sesión"
            });
        }

        res.redirect("/login")
    });
}