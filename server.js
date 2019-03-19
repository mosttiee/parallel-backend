const express = require('express')
const socketIO = require('socket.io')
const bodyParser = require("body-parser");
const http = require('http')

let app = express()
app.use(bodyParser.json());

app.use( (req, res, next) => {
  res.set('Content-Type', 'application/json');
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next()
})

let server = http.createServer(app)

let io = socketIO.listen(server, {log:false, origins:'*:*'})
const port = (process.env.PORT || 4000)

app.get('/api/hello', (req, res) => {
  const data = {
    Hello: 'World',
  }
  res.status(200)
  res.send(JSON.stringify(data))
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
