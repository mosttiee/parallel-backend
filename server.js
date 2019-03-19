const express = require('express')
const socketIO = require('socket.io')
http = require('http')
app = express()
server = http.createServer(app)
io = socketIO.listen(server)
const port = (process.env.PORT || 3000)

// test test
app.get('/', (req, res) => {
  res.send('hello')
});

app.post('/login', (req, res) => {
  res.send('login Api')
});

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
