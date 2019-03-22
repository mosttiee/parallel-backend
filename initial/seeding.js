const mongoose = require("mongoose");
const User = require("../models/User");
const Room = require("../models/Room");

module.exports = {
  seed_database: async function() {
    //---- Create User ----
    let user_beam = new User({
      name: "beam"
    });

    let user_job = new User({
      name: "job"
    });

    let user_bob = new User({
      name: "bob"
    });

    await user_beam.save();
    await user_job.save();
    await user_bob.save();

    //---- Create Rooms ----
    let room_a01 = new Room({
      roomName: "A01",
      messages: [
        {
          text: "First line",
          sender: user_beam._id
        },
        {
          text: "Second line",
          sender: user_job._id
        },
        {
          text: "Third line",
          sender: user_bob._id
        }
      ],
      members: [user_beam._id, user_job._id]
    });
    let room_a02 = new Room({
      roomName: "A02",
      messages: [
        {
          text: "First line02",
          sender: user_beam._id
        },
        {
          text: "Second line02",
          sender: user_bob._id
        },
        {
          text: "Third line02",
          sender: user_bob._id
        }
      ],
      members: [user_beam._id, user_job._id, user_bob._id]
    });

    await room_a01.save(function(error) {
      if (!error) {
        Room.find({})
          .populate("members")
          .populate("messages.sender")
          .exec(function(error, rooms) {
            console.log(JSON.stringify(rooms, null, "\t"));
          });
      }
    });

    await room_a02.save(function(error) {
      if (!error) {
        Room.find({})
          .populate("members")
          .populate("messages.sender")
          .exec(function(error, rooms) {
            console.log(JSON.stringify(rooms, null, "\t"));
          });
      }
    });

    //join room
    user_beam.joinedRoom = [
      {
        room: room_a01._id,
        lastestRead: "-1"
      },
      {
        room: room_a02._id,
        lastestRead: "-1"
      }
    ];

    user_job.joinedRoom = [
      {
        room: room_a01._id,
        lastestRead: "-1"
      },
      {
        room: room_a02._id,
        lastestRead: "-1"
      }
    ];

    user_bob.joinedRoom = [
      {
        room: room_a02._id,
        lastestRead: "-1"
      }
    ];

    user_bob.notJoinedRoom = [room_a01._id];

    await user_beam.save();
    await user_job.save();
    await user_bob.save();
  }
};
