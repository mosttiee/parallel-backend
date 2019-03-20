const mongoose = require('mongoose')
const User = require('../models/User')
const Room = require('../models/Room')

module.exports = {
    seed_database: function () {
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

        user_beam.save();
        user_job.save();
        user_bob.save();


        //---- Create Rooms ----
        let room_a01 = new Room({
            roomName: "A01",
            messages: [{
                text: "First line",
                sender: user_beam._id
            }, {
                text: "Second line",
                sender: user_job._id
            }, {
                text: "Third line",
                sender: user_bob._id
            }],
            members: [user_beam._id, user_job._id, user_bob._id]
        });
        let room_a02 = new Room({
            roomName: "A02",
            messages: [{
                text: "First line02",
                sender: user_beam._id
            }, {
                text: "Second line02",
                sender: user_bob._id
            }, {
                text: "Third line02",
                sender: user_bob._id
            }],
            members: [user_beam._id, user_job._id, user_bob._id]
        });

        room_a01.save(function (error) {
            if (!error) {
                Room.find({})
                    .populate('members')
                    .populate('messages.sender')
                    .exec(function (error, rooms) {
                        console.log(JSON.stringify(rooms, null, "\t"))
                    })
            }
        });

        room_a02.save(function (error) {
            if (!error) {
                Room.find({})
                    .populate('members')
                    .populate('messages.sender')
                    .exec(function (error, rooms) {
                        console.log(JSON.stringify(rooms, null, "\t"))
                    })
            }
        });

        //join room
        user_beam.joinedRoom = [{
            room: room_a01._id,
            lastestRead: ''
        }, {
            room: room_a02._id,
            lastestRead: ''
        }]

        user_job.joinedRoom = [{
            room: room_a01._id,
            lastestRead: ''
        }, {
            room: room_a02._id,
            lastestRead: ''
        }]

        user_bob.joinedRoom = [{
            room: room_a02._id,
            lastestRead: ''
        }]

        user_beam.save();
        user_job.save();
        user_bob.save();
        
    }
}