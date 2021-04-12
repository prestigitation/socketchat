const { compareSync } = require('bcrypt')
const pool = require('./db')
class MessageController {
    async sendMessage(message) {
        try {
            await pool.query("INSERT INTO messages (room_id,sender_id,message,time) VALUES ($1,$2,$3,now());", [
                message.roomId, message.senderId, message.message
            ])
        } catch (error) {
            console.error(error)
        }
    }

    async prepareMessage(msg) {
        let newMessage = await pool.query("SELECT room_id,message,login,time from messages msg left join users usrs on msg.sender_id = usrs.id WHERE room_id=$1 AND message = $2 ORDER BY room_id DESC LIMIT 1;", [
            msg.roomId, msg.message
        ])
        const { room_id, message, login, time } = newMessage.rows[0]
        console.log(new Date(time).toLocaleDateString())
        return {
            room_id,
            message,
            login,
            time: new Date(time).toLocaleDateString()
        }
    }

    async getRoomMessages(room_id) {
        let query = await pool.query("SELECT * from messages WHERE room_id = $1", [room_id])
        return this.fetchMessages(query.rows)
    }
    async fetchMessages(messages) {
        let result = []
        console.log(messages)
        for (let i = 0; i < messages.length; i++) {
            let sender = await pool.query("SELECT login FROM users WHERE id = $1", [messages[i].sender_id])
            result.push({
                login: sender.rows[0].login,
                message: messages[i].message,
                time: new Date(messages[i].time).toLocaleDateString()
            })
        }
        console.log(result)
        return result
    }
}
module.exports = MessageController