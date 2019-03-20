const mongoose = require('mongoose');
const User = require('./User')

const userRef = {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

const MessageSchema = new mongoose.Schema({
    text: {type: String, default:'', trim:true},
    sender: userRef
});

const RoomsSchema = new mongoose.Schema({
    // roomID: {type: String, default:'', trim:true, required: true},
    roomName: {type: String, default:'', trim:true, required: true},
    messages: [MessageSchema],
    members: [userRef]
});

const model_room = mongoose.model('Room', RoomsSchema);
// const model_message = mongoose.model('Message', MessageSchema);

module.exports = model_room;

// module.exports = {
//     Room: model_room,
//     Message: model_message
// };