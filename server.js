const express = require("express");
const app = express()
const path = require("path")
const http = require('http')
const socketIO = require('socket.io');



const publicPath = path.join(__dirname, './public')

let server = http.createServer(app)
let io = socketIO(server)


const port = process.env.PORT || 3030
io.on('connection', (socket) => {
    console.log("a new user just connected");

    socket.emit('newMessage', {
        from: "Admin",
        text: 'Welcome to the chat room!',
        createdat: new Date().getTime()
    });
    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: 'New User joined',
        createdat: new Date().getTime()
    })

    socket.on('createMessage', (message) => {
        console.log(message);
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            createdat: new Date().getTime()
        })
    })
    socket.on('disconnect', () => {
        console.log("user was disconnected")
    })
})





app.use(express.static(publicPath))
server.listen(port, () => {
    console.log("your server is up")
})