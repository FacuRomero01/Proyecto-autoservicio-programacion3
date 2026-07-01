import connection from "../database/db.js";

export const loginView = (req, res) => {
    res.render("login", {
        title: "Login",
        about: "Introduce tus credenciales",
        archivoCss: "/css/index.css"
    })
}

export const getAdminUser = async (req, res) => {

    try {
        const { email, password } = req.body;

        if(!email || !password) {
            return res.render("login", {
                title: "Login",
                about: "Introduce tus credenciales",
                archivoCss: "/css/index.css",
                error: "Todos los campos son obligatorios"
            });
        }

        const sql = "SELECT * FROM usuario WHERE email = ? and contraseña = ?";
        const [rows] = await connection.query(sql, [email, password]);

        if (rows.length === 0) {
            return res.render("login", {
                title: "Login",
                about: "Introduce tus credenciales",
                archivoCss: "/css/index.css",
                error: "Credenciales incorrectas"
            });
        }

        const user = rows[0];
        console.table(user);

        req.session.user = {
            id: user.id,
            nombre: user.nombre,
            email: user.email
        }

        res.redirect("/dashboard/index");

    } catch (error) {
        console.log(error)
    }
}