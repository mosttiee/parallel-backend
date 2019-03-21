const dotenv = require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const Room = require("./models/Room");
const User = require("./models/User");
const seeder = require("./initial/seeding");

const port = process.env.PORT || 8000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/gchat";

let app = express()
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let server = app.listen(port, () => console.log(`Example app listening on port ${port}!`))

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
mongoose.set("useCreateIndex", true);

app.get('/api/hello', (req, res) => {
  const data = {
    Hello: 'World',
  }
});

mongoose.connect(MONGODB_URI, { useNewUrlParser: true }).then(
  () => {},
  err => {
    console.log("connection to database error");
  }
);
mongoose.set("useCreateIndex", true);

app.get("/", (req, res) => {
  res.send("hello root world on port:" + port);
});

//db query section /api/database/room?roomName=A01
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

/**
 * Api to create room
 * @usage /api/createroom, {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}
 * @returns {confirmation: "success/fail", data: { roomID: room._id, roomName: room.roomName }/errorMessage}
 */
app.post("/api/createroom", async (req, res) => {
  const data = req.body;
  let user = await User.findById(mongoose.Types.ObjectId(data.userID));
  if (!user) {
    res.json({
      confirmation: "fail",
      data: "A user with ID " + data.userID + " doesn't exist"
    });
  }
  Room.create({ roomName: data.roomName, messages: [], members: [user._id] })
    .then(room => {
      user.joinedRoom.push({ room: room._id, lastestRead: "" });
      // console.log(user)
      user.save();
      User.updateMany({}, { $push: { notJoinedRoom: [{ room: room._id }] } });
      res.json({
        confirmation: "success",
        data: { roomID: room._id, roomName: room.roomName }
      });
    })
    .catch(err => {
      res.json({
        confirmation: "fail",
        message: err.message
      });
    });
});

//create user by json body /api/database/user, {name:testname, joinedRoom:[]}
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

app.get("/api/database/user/:username", async (req, res) => {
  const name = req.params.username;
  const curUser = await User.findOne({ name });
  if (!curUser) {
    res.status(403).send("Successfully create user name:" + name);
    let user = new User({ name: name });
    user.save();
  }
  const token = {
    id: curUser._id,
    name: curUser.name,
    joinedRoom: curUser.joinedRoom,
    notJoinedRoom: curUser.notJoinedRoom
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

let io = socket(server)

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("chat", function(msg) {
    io.sockets.emit("new-msg", msg);
    console.log(msg);
  });
});
