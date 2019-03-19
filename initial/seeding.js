const mongoose = require('mongoose')
const User = require('../models/User')
const Rooms = require('../models/Rooms')

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
        let rooms_root = new Rooms({
            rooms: [{
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
            }, {
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
            }]
        });

        rooms_root.save(function (error) {
            if (!error) {
                Rooms.find({})
                    .populate('rooms.members')
                    .populate('rooms.messages.sender')
                    .exec(function (error, rooms) {
                        console.log(JSON.stringify(rooms, null, "\t"))
                    })
            }
        });
    }
}