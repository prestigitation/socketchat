const express = require('express')
const app = express()

const userController = require('./UserController.js')
const roomController = require('./RoomController.js')
const messageController = require('./MessageController.js')
const UserController = new userController()
const RoomController = new roomController()
const MessageController = new messageController()

app.listen(5791, () => {
    console.log('listening server on 5791')
})
app.use(express.json())
app.use(require('cors')())
app.set('Access-Control-Allow-Origin', 'http://localhost:5791')
app.set('Access-Control-Allow-Origin', 'http://localhost:5792')
app.set('Access-Control-Allow-Origin', 'http://localhost:8080')

app.post('/register', async(req, res) => {
    try {
        let user = await UserController.createUser(req.body)
        res.type('json').send(user)
    } catch (error) {
        console.log(error)
    }
})

app.post('/login', async(req, res) => {
    try {
        let user = await UserController.getUser(req.body)
        if (user) {
            res.type('json').send(user)
        }
    } catch (error) {
        console.log(error)
    }
})

app.post('/search', async(req, res) => {
    try {
        let result = await UserController.findUser(req.body)
        res.type('json').send(result)
    } catch (error) {
        console.log(error)
    }
})

app.post('/room', async(req, res) => {
    let roomExists = await RoomController.checkIfExist(req.body)
    if (!roomExists) {
        await RoomController.createRoom(req.body).then(async(room_id) => {
            await RoomController.getRoom(req.body).then((room_id) => {
                res.json(room_id)
            })
        })
    } else {
        await RoomController.getRoom(req.body).then((room_id) => {
            res.json(room_id)
        })
    }
})

const serv = require('http').createServer().listen(5792)
const io = require("socket.io")(serv, {
    cors: {
        origin: 'http://localhost:8080',
        credentials: true,
    },
    allowEIO3: true
})

io.on('connection', (socket) => {
    socket.on('joinRoom', (room) => {
        socket.join(room)
        console.log('joined' + room)
    })

    socket.on('newMessage', async(message) => {
        console.log(message)
        try {
            await MessageController.sendMessage(message)
            let frontendMessage = await MessageController.prepareMessage(message)
            io.to(message.roomId).emit('frontendMessage', frontendMessage)
        } catch (error) {
            console.log(error)
        }
    })

    socket.on('getAllMessages', async(room_id) => {
        let messages = await MessageController.getRoomMessages(room_id)
        socket.emit('loadMessages', messages)
    })

    socket.on('sendMessageToFrontend', async(message) => {
        let newMessage = await MessageController.prepareMessage(message)
    })
})