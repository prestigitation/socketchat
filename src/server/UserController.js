const pool = require('./db')
class UserController {
    async createUser(body) {
        try {
            let result = await pool.query('INSERT INTO users(login,email,password) VALUES ($1,$2,$3) RETURNING id,login;', [
                body.login, body.email, body.password
            ])
            return result.rows[0]
        } catch (error) {
            console.error(error)
        }
    }

    async getUser(body) {
        console.log(body)
        let query = await pool.query("SELECT id,login FROM users WHERE (login=$1) AND (password=$2);", [body.login, body.password])
        return query.rows[0]
    }
    async findUser(body) {
        let query = await pool.query("SELECT id,login FROM users WHERE login  LIKE $1 LIMIT 10;", ["%" + body.search + "%"])
        return query.rows
    }
}
module.exports = UserController