const mongoose = require('mongoose');
const User = require('./User.js')

const userRef = {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

const message = {
    text: {type: String, default:'', trim:true},
    sender: userRef
}

const RoomsSchema = new mongoose.Schema({
    rooms: [{
        // roomID: {type: String, default:'', trim:true, required: true},
        roomName: {type: String, default:'', trim:true, required: true},
        messages: [message],
        members: [userRef]
    }]
});

module.exports = mongoose.model('Rooms', RoomsSchema);