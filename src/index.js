const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const PORT = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.emit('message', 'Welcome!')
    socket.broadcast.emit('message', 'A new user has joined!')

    socket.on('sendMessage', (message) => {
        io.emit('message', message)
    })

    socket.on('disconnect', () =>{
        io.emit('message', 'A user has left the chat!')
    })

    socket.on('sendLocation', location => {
        io.emit('message', `Location: ${location.latitude}, ${location.longitude} or click on the link: https://google.com/maps?q=${location.latitude},${location.longitude}`)
    })

})

server.listen(PORT, () => console.log(`Server listen on port ${PORT}`))
