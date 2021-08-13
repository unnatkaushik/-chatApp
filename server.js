const express = require("express");
const app = express()
const path = require("path")
const http = require('http')
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message')


const publicPath = path.join(__dirname, './public')

let server = http.createServer(app)
let io = socketIO(server)


const port = process.env.PORT || 3030
io.on('connection', (socket) => {
    console.log("a new user just connected");

    socket.emit('newMessage', generateMessage("Admin", 'Welcome to the chat room!'));
    socket.broadcast.emit('newMessage', generateMessage("Admin", 'New User joined'))

    socket.on('createMessage', (message, callback) => {
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback("this ping is from server")
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("Admin", coords.lat, coords.lng))
    })
    socket.on('disconnect', () => {
        console.log("user was disconnected")
    })
})





app.use(express.static(publicPath))
server.listen(port, () => {
    console.log("your server is up")
})