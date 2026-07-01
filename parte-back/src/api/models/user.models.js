import connection from "../database/db.js";

const selectAdminUsers = (email, password) => {
    const sql = "SELECT * FROM usuario WHERE email = ? and contraseña = ?";

    return connection.query(sql, [email, contraseña]);
}

export default{
    selectAdminUsers
}