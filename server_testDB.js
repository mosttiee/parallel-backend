const dotenv = require("dotenv").config();
const express = require("express");
const socketIO = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");

const Room = require("./models/Room");
const User = require("./models/User");
const seeder = require("./initial/seeding");

app = express();
app.use(bodyParser.json());
server = http.createServer(app);
io = socketIO.listen(server);
const port = process.env.PORT || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gchat";

//processing arguments
const args = process.argv;
console.log("arguments are: ");
process.argv.forEach(function(val, index, array) {
  console.log(index + ": " + val);
  if (index >= 2) {
    if (val == "seed_database") {
      console.log("seeding database...");
      seeder.seed_database();
    }
  }
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(
  () => {},
  err => {
    console.log("connection to database error");
  }
);

// test test
app.get("/api/hello", (req, res) => {
  res.send(JSON.stringify({ Hello: "World" }));
});

app.post("/api/login", (req, res) => {
  res.send("login Api");
});

app.get("/", (req, res) => {
  res.send("hello root world");
});

//db query secition
app.get("/api/database/room", (req, res) => {
  const query = req.query;

  let filter = null;
  if (query.roomName != null) {
    filter = {
      roomName: query.roomName
    };
  }
  Room.find(filter)
    .then(rooms => {
      res.json({
        confirmation: "success",
        data: rooms
      });
    })
    .catch(err => {
      res.json({
        confirmation: "fail",
        message: err.message
      });
    });
});

//create user
app.post("/api/database/user", (req, res) => {
  // console.log('recieve a request with this body')
  // console.log(req.body)
  // console.log('end body')
  User.create(req.body)
    .then(user => {
      res.json({
        confirmation: "success",
        data: user
      });
    })
    .catch(err => {
      res.json({
        confirmation: "fail",
        message: err.message
      });
    });
});

app.get("/api/database/user/:name", async (req, res) => {
  const name = req.params.name;
  const curUser = await User.findOne({ name });
  //   const id = await curUser._id;
  if (!curUser) return res.status(403).send("Invalid username or password");
  const token = {
    id: curUser._id,
    name: curUser.name
  };
  res.send(token);
});

//get user by id
// app.get("/api/database/user/:id", (req, res) => {
//   const id = req.params.id;

//   User.findById(id)
//     .then(user => {
//       res.json({
//         confirmation: "success",
//         data: user
//       });
//     })
//     .catch(err => {
//       res.json({
//         confirmation: "fail",
//         message: "User " + id + " not found."
//       });
//     });
// });

app.get("/testdb", (req, res) => {
  Room.find()
    .then(rooms => {
      res.json({
        confirmation: "success",
        data: rooms
      });
    })
    .catch(err => {
      res.json({
        confirmation: "fail",
        message: err.message
      });
    });
});

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });
  socket.on("chat", function(msg) {
    socket.broadcast.emit("chat", msg);
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
