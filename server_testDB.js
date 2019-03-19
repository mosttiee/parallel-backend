const express = require('express')
const socketIO = require('socket.io')
const mongoose = require('mongoose')
const Room = require('./models/Room')
const seeder = require('./initial/seeding.js');
http = require('http')
app = express()
server = http.createServer(app)
io = socketIO.listen(server)
const port = 3000

const args = process.argv;
console.log('arguments are: ');
process.argv.forEach(function (val, index, array) {
    console.log(index + ': ' + val);
    if(index >= 2){
        if(val == 'seed_database'){
            console.log('seeding database...');
            seeder.seed_database();
        }
    }
});


mongoose.connect('mongodb://localhost:27017/gchat', { useNewUrlParser: true }).then(
    () => { },
    err => { console.log('connection to database error') }
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
