const express = require('express')
const socketIO = require('socket.io')
const bodyParser = require("body-parser");
const http = require('http')

app = express()
app.use(bodyParser.json());
server = http.createServer(app)

io = socketIO.listen(server)
const port = (process.env.PORT || 3000)

// test test
app.get('/api/hello', (req, res) => {
  res.send(JSON.stringify({ Hello: 'World'}))
});

app.post('/api/login', (req, res) => {
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
