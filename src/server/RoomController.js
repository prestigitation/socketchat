const pool = require('./db')
class RoomController {
    async checkIfExist(body) {
        const { userId, userName, penmateId, penmateName } = body
        let query = await pool.query("SELECT id FROM rooms WHERE (first_user = $1 AND first_user = $2) OR (first_user = $2 AND second_user = $1)", [
            userId, penmateId
        ])
        if (query.rows.length > 0) {
            return query.rows[0].id
        } else {
            return false
        }
    }

    async createRoom(body) {
        const { userId, penmateId } = body
        try {
            let query =
                "INSERT INTO rooms (first_user, second_user) VALUES ($1,$2) RETURNING id;"
            let roomId = await pool.query(query, [userId, penmateId])
            if (roomId.rows[0].id) { return roomId.rows[0].id } else return false
        } catch (e) { console.log(e) }
    }

    async getRoom(body) {
        const { userId, penmateId } = body
        let roomId = await pool.query("SELECT id FROM rooms WHERE (first_user = $1 AND second_user = $2) OR (first_user = $2 AND second_user = $1);", [userId, penmateId])
        return roomId.rows[0].id
    }
}

module.exports = RoomController