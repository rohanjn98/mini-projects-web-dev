require('dotenv').config()
const path = require('path')
const express = require('express')
const hbs = require('hbs')
const http = require('http')
const Filter = require('bad-words')
const socketio = require('socket.io')
const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

// Define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Configure server to work with socket.io
const app = express()
const server = http.createServer(app)
const io = socketio(server)

// Setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.use(express.json())

app.get('/', (req, res) => {
    res.send('index.html')
})

// socket is an obj that contains info about connection
io.on('connection', (socket) => {
    console.log('New WebSocket connection.');    

    socket.on('join', ({ username, room }, callback) => {

        const { error, user } = addUser({ id: socket.id, username, room })

        if (error) {
            return callback(error)
        }

        socket.join(user.room)
        socket.emit('message',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin',`${user.username} has joined!`))

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback()
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        if (user) {
            const filter = new Filter()

            if (filter.isProfane(message)) {
                return callback('Profanity is not allowed!')
            }

            io.to(user.room).emit('message', generateMessage(user.username, message))
            callback()
        }
        
    })

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id)

        if (user) {
            io.to(user.room).emit('locationMessage', generateLocationMessage(user.username,`https://google.com/maps?q=${location.latitude},${location.longitude}`))
            callback()    
        }
        
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', generateMessage(`${user.username} has left!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }        
    })
})

const port = process.env.PORT || 3000
server.listen(port, () => {
    console.log('Server is up on ' + port);
})
