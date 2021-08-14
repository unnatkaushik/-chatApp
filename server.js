const express = require("express");
const app = express()
const path = require("path")
const http = require('http')
const socketIO = require('socket.io');
const { generateMessage, generateLocationMessage } = require('./utils/message')
const { isRealString } = require('./utils/isRealString')
const { Users } = require('./utils/users')

const publicPath = path.join(__dirname, './public')

let server = http.createServer(app)
let io = socketIO(server)
let users = new Users;

const port = process.env.PORT || 3030
io.on('connection', (socket) => {
    console.log("a new user just connected");


    socket.on('join', (params, callback) => {
        console.log(params)
        if (!isRealString(params.user) || !isRealString(params.rooms)) {
            return callback("Please enter a valid details")
        }

        socket.join(params.rooms);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.user, params.rooms)
        io.to(params.rooms).emit('updateUserList', users.getUserList(params.rooms));


        socket.emit('newMessage', generateMessage("Admin", `Welcome to the ${params.rooms}`));
        socket.broadcast.to(params.rooms).emit('newMessage', generateMessage("Admin", 'New User joined'))

        callback()
    })







    socket.on('createMessage', (message, callback) => {
        console.log(message);
        io.emit('newMessage', generateMessage(message.from, message.text))
        callback("this ping is from server")
    })

    socket.on('createLocationMessage', (coords) => {
        io.emit('newLocationMessage', generateLocationMessage("Admin", coords.lat, coords.lng))
    })
    socket.on('disconnect', () => {
        let user = users.removeUser(socket.id);

        console.log("users", user)
        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage("Admin", `${user.name} has left ${user.room} room`));
        }

    })
})





app.use(express.static(publicPath))
server.listen(port, () => {
    console.log("your server is up")
})