const express = require('express')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
const Room = require('./models/Room')
http = require('http')
app = express()
server = http.createServer(app)
io = socketIO.listen(server)
const port = 3000

mongoose.connect('mongodb://localhost:27017/gchat', {useNewUrlParser: true}).then(
    () => {},
    err => {console.log('connection to database error')}
);

app.get('/', (req, res) => {
  res.send('hello')
});

app.post('/login', (req, res) => {
  res.send('login Api')
});

app.get('/testdb', (req, res) => {
    Room.find()
    .then(rooms => {
        res.json({
            confirmation: 'success',
            data: rooms
        })
    })
    .catch(err => {
        res.json({
            confirmation: 'fial',
            message: err.message
        })
    })
})

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
    socket.on('chat', function (msg) {
        socket.broadcast.emit('chat', msg);
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
