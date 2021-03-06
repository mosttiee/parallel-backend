const dotenv = require("dotenv").config();
const express = require("express");
const socket = require("socket.io");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const redis = require("socket.io-redis");

const Room = require("./models/Room");
const User = require("./models/User");
const seeder = require("./initial/seeding");

const port = process.env.PORT || 8000;
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gchat";

let app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

//processing arguments
const args = process.argv;
console.log("arguments are: ");
args.forEach(function(val, index, array) {
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

app.get("/", (req, res) => {
  res.send("hello root world on port:" + port);
});

app.get("/allrooms", async (req, res) => {
  let room = await Room.find({}).select({ roomName: 1 });
  res.json({
    status_code: 200,
    body: room
  });
});

app.post("/allrooms", async (req, res) => {
  const roomName = req.body.id;
  let room = await Room.findOne({ roomName: roomName });
  if (room) {
    res.json({
      status_code: 404,
      body: roomName + " already exists"
    });
  }
  Room.create({ roomName: roomName, messages: [], members: [] })
    .then(async room => {
      console.log(room);
      User.updateMany({}, { $push: { notJoinedRoom: room._id } }).exec();
      res.json({
        status_code: 201,
        body: "id " + roomName
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        status: "fail",
        message: err.message
      });
    });
});

app.put("/allrooms", async (req, res) => {
  const roomName = req.body.id;
  let room = await Room.findOne({ roomName: roomName });
  if (room) {
    res.json({
      status_code: 200,
      body: "id: " + roomName
    });
  }
  Room.create({ roomName: roomName, messages: [], members: [] })
    .then(async room => {
      User.updateMany({}, { $push: { notJoinedRoom: room._id } }).exec();
      res.json({
        status_code: 201,
        body: "id " + roomName
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        status: "fail",
        message: err.message
      });
    });
});

app.delete("/allrooms", async (req, res) => {
  const roomID = req.body.id;
  let room = await Room.findOne({ roomName: roomName });
  if (!room) {
    res.json({
      status_code: 404,
      body: "Room id is not found"
    });
  }

  await Room.findByIdAndDelete(mongoose.Types.ObjectId(room._id))
    .lean()
    .populate("members")
    .then(room => {
      User.updateMany(
        {},
        {
          $pull: { joinedRoom: { room: room._id } }
        },
        {
          $pull: { notJoinedRoom: room._id }
        }
      ).exec();
      res.json({
        status_code: 200,
        body: roomName + " is deleted"
      });
    })
    .catch(err => {
      console.log(err);
      res.json({
        status: "fail",
        message: err.message
      });
    });
});

app.get("/room/:ROOM_ID", async (req, res) => {
  const roomID = req.params.ROOM_ID;
  await Room.findOne({ _id: roomID })
  .then(async room => {
    console.log(room)
    if (room) {
      let members = room.members
      members = await Promise.all(members.map(async memberID => {
        const member = await User.findOne({_id: memberID})
        console.log(member.name)
        return member.name
      }))
      console.log(members)
      res.json({
        status_code: 200,
        body: ssssdsawedmembers
      });
    }else{
      res.json({
        status_code: 404,
        body: "Room does not exist"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      status_code: 404,
      body: "Room does not exist"
    });
  });
});

app.post("/room/:ROOM_ID", async (req, res) => {
  const roomID = req.params.ROOM_ID;
  const userName = req.body.user
  await Room.findOne({ _id: roomID })
  .then(async room => {
    if (room) {
      let members = room.members
      const user = await User.findOne({name: userName})
      if(user){
        if(room.members.indexOf(user._id)+1){
          res.json({
            status_code: 200,
            body: {}
          });
        }else{
          res.json({
            status_code: 201,
            body: {}
          });
        }
      }else{
        res.json({
          status_code: 201,
          body: {}
        });
      }
    }else{
      res.json({
        status_code: 404,
        body: "Room does not exist"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      status_code: 404,
      body: "Room does not exist"
    });
  });
});

app.put("/room/:ROOM_ID", async (req, res) => {
  const roomID = req.params.ROOM_ID;
  const userName = req.body.user
  await Room.findOne({ _id: roomID })
  .then(async room => {
    if (room) {
      let members = room.members
      const user = await User.findOne({name: userName})
      if(user){
        if(room.members.indexOf(user._id)+1){
          res.json({
            status_code: 200,
            body: {}
          });
        }else{
          res.json({
            status_code: 201,
            body: {}
          });
        }
      }else{
        res.json({
          status_code: 201,
          body: {}
        });
      }
    }else{
      res.json({
        status_code: 404,
        body: "Room does not exist"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      status_code: 404,
      body: "Room does not exist"
    });
  });
});

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr].toString() === value) {
            return i;
        }
    }
    return -1;
}

app.delete("/room/:ROOM_ID", async (req, res) => {
  const roomID = req.params.ROOM_ID;
  const userName = req.body.user
  await Room.findOne({ _id: roomID })
  .then(async room => {
    if (room) {
      const user = await User.findOne({name: userName})
      if(user){
        const userIndex = room.members.indexOf(user._id)
        const roomIndex = findWithAttr(user.joinedRoom, 'room', roomID)
        if((userIndex+1)&(roomIndex+1)){

          Room.updateOne({_id: roomID},
          { members: room.members.splice(userIndex, 1) }).catch(err => {
            console.log(err)
          })
          User.updateOne({_id: user._id},
          { joinedRoom: user.joinedRoom.splice(roomIndex, 1)})
          User.updateOne({_id: user._id}, {$push: { notJoinedRoom: roomID}})

          console.log('**************************************')
          console.log(room.members)
          console.log(userIndex)
          room.members.splice(userIndex, 1)
          console.log(room.members)
          console.log(user.joinedRoom)
          console.log(roomIndex)
          user.joinedRoom.splice(roomIndex, 1)
          console.log(user.joinedRoom)

          res.json({
            status_code: 200,
            body: "USERS_ID leaves the room"
          });
        }else{
          res.json({
            status_code: 404,
            body: "User id is not found"
          });
        }
      }else{
        res.json({
          status_code: 404,
          body: "User id is not found"
        });
      }
    }else{
      res.json({
        status_code: 404,
        body: "Room does not exist"
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.json({
      status_code: 404,
      body: "Room does not exist"
    });
  });
});

app.get("/users", async (req, res) => {
  let user = await User.find({}).select({ name: 1 });
  res.json({
    status_code: 200,
    body: user
  });
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
 * @returns {confirmation: "success/fail", data: { joinedRoom: [{ "lastestRead": "-1", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}],
 * notJoinedRoom: [{ "lastestRead": "-1", "_id": "5c932df18662054eacc48ae0", "room": { "_id": "5c932df18662054eacc48ad5", "roomName": "A01"}}] }/errorMessage}
 */
app.get("/api/room/getroomlist", (req, res) => {
  const query = req.query;
  if (query.userID == null) {
    res.json({
      confirmation: "fail",
      message: "?userID=abcdefg is required"
    });
    return;
  }
  User.findById(mongoose.Types.ObjectId(query.userID))
    .lean()
    .populate("joinedRoom.room", "roomName")
    .populate("notJoinedRoom", "roomName")
    .exec()
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
  // console.log(data)
  let user = await User.findById(mongoose.Types.ObjectId(data.userID));
  if (!user) {
    res.json({
      confirmation: "fail",
      data: "A user with ID " + data.userID + " doesn't exist"
    });
  }
  Room.create({ roomName: data.roomName, messages: [], members: [user._id] })
    .then(async room => {
      await User.updateMany({}, { $push: { notJoinedRoom: room._id } }).exec();
      user.joinedRoom.push({ room: room._id, lastestRead: "-1" });
      // console.log("pulling " + room._id)
      user.notJoinedRoom.pull(room._id);
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

async function joinRoom(userID, roomID) {
  let resultObj = {};
  let user = await User.findById(mongoose.Types.ObjectId(userID));
  if (!user) {
    resultObj = {
      confirmation: "fail",
      data: "A user with ID " + userID + " doesn't exist"
    };
    return resultObj;
  }

  for (let i = user.joinedRoom.length; i--; ) {
    if (user.joinedRoom[i].room.toString() == roomID) {
      resultObj = {
        confirmation: "fail",
        data: "A user with ID " + userID + " has been joined this group already"
      };
      return resultObj;
    }
  }
  await Room.findByIdAndUpdate(mongoose.Types.ObjectId(roomID), {
    $push: { members: user._id }
  })
    .exec()
    .then(room => {
      user.joinedRoom.push({
        room: room._id,
        lastestRead: "-1"
      });
      user.notJoinedRoom.pull(room._id);
      user.save();
      resultObj = {
        confirmation: "success",
        data: "userID: " + userID + " successfully joined roomID: " + roomID
      };
    })
    .catch(err => {
      resultObj = {
        confirmation: "fail",
        message: err.message
      };
    });
  return resultObj;
}
/**
 * Api to join room
 * @usage /api/room/join, {userID: '5c92fc59cf67874acc2d0b2e', roomID: '5c92fc59cf67874acc2d0b2e'}
 * @returns {confirmation: "success/fail", data: successfulMessage/errorMessage}
 */
app.post("/api/room/join", async (req, res) => {
  const data = req.body;
  joinRoom(data.userID, data.roomID).then(resultObj => {
    res.json(resultObj);
  });
});

/**
 * API fetch message
 * @usage /api/room/fetchmessage, {roomID: '5c92fc59cf67874acc2d0b2e', lastestReadID:'-1'/'5c92fc59cf67874acc2d0b2e'}
 * @param {lastestReadID} can be -1 if you've not read anything yet
 * @returns {confirmation: "success/fail", data: [{ "text": "message test 1", "_id": "5c949ade34dd484198a9dbe2", "sender": "5c9495ed87afa201f437a4bc"}]/errorMessage}
 */
app.post("/api/room/fetchmessage", async (req, res) => {
  // console.log("inside /api/room/fetchmessage")
  const data = req.body;
  let room = await Room.findById(mongoose.Types.ObjectId(data.roomID))
    .lean()
    .populate("messages.sender", "name")
    .exec();
  if (!room) {
    res.json({
      confirmation: "fail",
      data: "A room with ID " + data.roomID + " doesn't exist"
    });
    return;
  }
  // console.log("room is: ")
  // console.log(room)
  // console.log("messages are: ")
  // console.log(room.messages)
  // console.log("messages[0]: ")
  // console.log(room.messages[0])
  // console.log("messages[0].keys(): ")
  // console.log(Object.keys(room.messages[0]))
  // console.log("messages[0]._id: ")
  // console.log(room.messages[0]._id)
  // console.log("typeof messages[0]._id: ")
  // console.log(typeof room.messages[0]._id)

  if (data.lastestReadID == -1) {
    res.json({
      confirmation: "success",
      data: room.messages.slice(0, room.messages.length)
    });
    return; //fetch everything
  }
  const lastestReadID = mongoose.Types.ObjectId(data.lastestReadID);
  const roomMessageLenght = room.messages.length;
  let fetchMessageLenght = roomMessageLenght >= 10 ? 10 : roomMessageLenght; //if room has less than 10 message then get the less number

  while (
    room.messages[roomMessageLenght - fetchMessageLenght]._id > lastestReadID
  ) {
    fetchMessageLenght += 1;
    // console.log(fetchMessageLenght + ": " + room.messages[roomMessageLenght-fetchMessageLenght]._id + " == " + lastestReadID + " res => " + (room.messages[roomMessageLenght-fetchMessageLenght]._id == lastestReadID))
  }
  while (
    room.messages[roomMessageLenght - fetchMessageLenght]._id < lastestReadID
  ) {
    fetchMessageLenght -= 1;
  }
  fetchMessageLenght -= 1;

  if (fetchMessageLenght == 0) {
    //already read latest message
    fetchMessageLenght = roomMessageLenght >= 10 ? 10 : roomMessageLenght; // fetch 10 latestes or less
    res.json({
      confirmation: "success",
      data: room.messages.slice(
        roomMessageLenght - fetchMessageLenght,
        roomMessageLenght
      )
    });
  } else {
    fetchMessageLenght =
      fetchMessageLenght < 10
        ? roomMessageLenght >= 10
          ? 10
          : roomMessageLenght
        : fetchMessageLenght;
    res.json({
      confirmation: "success",
      data: room.messages.slice(
        roomMessageLenght - fetchMessageLenght,
        roomMessageLenght
      )
    });
  }
});

//Api for leaving a room
//usage /api/room/leave , {userID: "userid", roomID:"roomID" }
app.post("/api/room/leave", async (req, res) => {
  const data = req.body;
  let user = await User.findById(mongoose.Types.ObjectId(data.userID));
  if (!user) {
    res.json({
      confirmation: "fail",
      data: "A user with ID " + data.userID + " doesn't exist"
    });
  }
  await Room.findByIdAndUpdate(mongoose.Types.ObjectId(data.roomID), {
    $pull: { members: user._id }
  })
    .exec()
    .then(room => {
      user.notJoinedRoom.push(room._id); //Good
      // user.joinedRoom.pull({ //This code will not work
      //   room: room._id,
      //   lastestRead: "-1"
      // });
      //remove joinedRoom from this object
      for (let i = user.joinedRoom.length; i--; ) {
        if (user.joinedRoom[i].room.toString() == room._id.toString()) {
          //console.log("found joinedroom to remove at index " + i);
          user.joinedRoom.splice(i, 1);
          break;
        }
      }
      user.save();
      let result = {
        confirmation: "success",
        data:
          "userID: " + user._id + " successfully leave roomID " + data.roomID
      };
      res.send(result);
    })
    .catch(err => {
      let result = {
        confirmation: "fail",
        data: err.message
      };
      res.send(result);
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

/**
 * store message to database when send message
 * @param {*} roomID id of room which you wish to send message in
 * @param {*} senderID id of sender who sends message
 * @param {*} messageText text of the message
 * @throws {*} errors
 */
async function sendMessageDB(roomID, senderID, messageText) {
  const update = {
    $push: {
      messages: {
        text: messageText,
        sender: senderID
      }
    }
  };
  return Room.findByIdAndUpdate(mongoose.Types.ObjectId(roomID), update, {
    new: true
  }).exec();
}

/**
 * API to update latest read message
 * @usage /api/user/updatelatestread, {userID: '5c92fc59cf67874acc2d0b2e', roomID: '5c92fc59cf67874acc2d0b2e', lastestReadID:'-1'/'5c92fc59cf67874acc2d0b2e'}
 * @param {lastestReadID} can be -1 if you've not read anything yet
 * @returns {confirmation: "success/fail", data: successfulMessage/errorMessage}
 */
app.post("/api/user/updatelatestread", async (req, res) => {
  const data = req.body;
  let user = await User.findById(mongoose.Types.ObjectId(data.userID));
  if (!user) {
    res.json({
      confirmation: "fail",
      data: "A user with ID " + data.userID + " doesn't exist"
    });
    return;
  }
  for (let i = user.joinedRoom.length; i--; ) {
    if (user.joinedRoom[i].room.toString() == data.roomID.toString()) {
      // console.log("found joinedroom to remove at index " + i + " and removing now");
      user.joinedRoom.splice(i, 1);
      break;
    }
  }
  user.joinedRoom.push({
    room: mongoose.Types.ObjectId(data.roomID),
    lastestRead: data.lastestReadID
  });
  await user.save();
  res.json({
    confirmation: "success",
    data: "A user with ID " + data.userID + " have been updated"
  });
});

app.get("/api/user/:username", async (req, res) => {
  const name = req.params.username;
  const curUser = await User.findOne({ name });
  if (!curUser) {
    // res.status(403).send("Successfully create user name:" + name);
    let notjoinlist = await Room.find({}).populate("room");
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

let testmsgi = 0;
app.get("/testsendmessagedb", async (req, res) => {
  console.log("sending message " + testmsgi);
  let ret = await sendMessageDB(
    "5c9495ed87afa201f437a4c1",
    "5c9495ed87afa201f437a4ba",
    "message test " + testmsgi
  );
  console.log(ret);
  testmsgi += 1;
  console.log("sent!!!! message " + testmsgi);
  res.json({ confirmation: "success" });
});

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

let io = socket(server);
io.adapter(redis({ host: "localhost", port: 6379 }));

io.on("connection", function(socket) {
  console.log("a user connected");
  socket.on("disconnect", function() {
    console.log("user disconnected");
  });

  socket.on("joinRoom", roomId => {
    socket.join(roomId, () => {
      let rooms = Object.keys(socket.rooms);
      console.log(rooms); // [ <socket.id>, 'room 237' ]
      //this.socket.to('room 237').emit('a new user has joined the room'); // broadcast to everyone in the room
    });
  });

  socket.on("leaveRoom", roomId => {
    socket.leave(roomId, () => {
      console.log("leaveRoom");
    });
  });

  socket.on("leaveRoomPermanantly", roomId => {
    socket.leave(roomId, () => {
      console.log("leaveRoomPermanantly");
    });
  });

  socket.on("message", async data => {
    const { roomId, text, userId } = data;
    console.log(data);
    const room = await sendMessageDB(roomId, userId, text);
    data["lastestRead"] = room.messages[room.messages.length - 1]._id;
    io.to(roomId).emit("new-msg", data);
  });
});
