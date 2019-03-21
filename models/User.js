const mongoose = require("mongoose");
const Room = require("./Room");

const roomRef = { type: mongoose.Schema.Types.ObjectId, ref: "Room" };
// const messageRef = {type: mongoose.Schema.Types.ObjectId, ref: 'Message'}

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    dropDups: true,
    trim: true,
    required: true
  }, //TODO ROOM, lastest read
  // password: { type: String, trim: true, required: false },
  joinedRoom: [
    {
      room: roomRef,
      lastestRead: { type: String, trim: true, default: "" } //When empty string it means that user never read any message
    }
  ],
  notJoinedRoom: [
    {
      room: roomRef
    }
  ]
});

module.exports = mongoose.model("User", UserSchema);
