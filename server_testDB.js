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

app.use((req, res, next) => {
  //res.set("Content-Type", "application/json");
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

// test test
app.get("/api/hello", (req, res) => {
  res.send(JSON.stringify({ Hello: "World" }));
});

app.post("/api/login", (req, res) => {
  res.send("login Api");
});

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
 * Api to get room list(both join and unjoin) from a user
 * @usage /api/room/getroomlist?userID=5c92fc59cf67874acc2d0b2e
 * @returns {confirmation: "success/fail", data: { joinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}], 
 * notJoinedRoom: [{ "lastestRead": "", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}] }/errorMessage}
 */
app.get("/api/room/getroomlist", (req, res) => {
    const query = req.query;
    if(query.userID == null){
        res.json({
            confirmation: "fail",
            message: "?userID=abcdefg is required"
        });
        return;
    }
    User.findById(mongoose.Types.ObjectId(query.userID)).populate('joinedRoom.room', 'roomName').populate('notJoinedRoom.room', 'roomName').exec()
    .then(user => {
        res.json({
          confirmation: "success",
          data: { joinedRoom: user.joinedRoom, notJoinedRoom: user.notJoinedRoom }
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
 * @usage /api/room/createroom, {roomName: 'aroomname', userID: '5c92fc59cf67874acc2d0b2e'}
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
