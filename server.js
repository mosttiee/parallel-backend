const dotenv = require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");

const Room = require("./models/Room");
const User = require("./models/User");
const seeder = require("./initial/seeding");

app = express();
app.use(bodyParser.json());
server = http.createServer(app);
io = socket.listen(server);
const port = process.env.PORT || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gchat";

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

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

//test test
app.get("/api/hello", (req, res) => {
  const data = {
    Hello: "World"
  };
  res.status(200);
  res.send(JSON.stringify(data));
});

app.post("/api/login", (req, res) => {
  res.send("login Api");
});

/**
 * Api to create room
 * @usage /api/createroom, {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}
 * @returns {confirmation: "success/fail", data: { roomID: room._id, roomName: room.roomName }/errorMessage}
 */
app.post("/api/room/createroom", async (req, res) => {
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
      User.updateMany(
        {},
        { $push: { notJoinedRoom: { room: room._id } } }
      ).exec();
      user.joinedRoom.push({ room: room._id, lastestRead: "" });
      // console.log(user)
      user.save();
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

//Api return name and id for login
app.get("/api/user/:username", async (req, res) => {
  const name = req.params.username;
  const curUser = await User.findOne({ name });
  if (!curUser) {
    // res.status(403).send("Successfully create user name:" + name);
    let notjoinlist = await Room.find({}); //.populate({ path: "notJoinedRoom.room", select: "roomName" });
    let user = new User({
      name: name,
      notJoinedRoom: notjoinlist
    });
    user.save();
    const token = {
      id: user._id,
      name: name
    };
    res.send(token);
  } else {
    const token = {
      id: curUser._id,
      name: curUser.name
    };
    res.send(token);
  }
});

// let io = socket(server);

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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
