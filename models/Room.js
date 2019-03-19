const mongoose = require('mongoose');

const Room = new mongoose.Schema({
    roomID: {
        messageID: {
            text: {type:String, trim:true, default:''},
            senderID: {type:String, trim:true, default:''}
        },
        memberID: {}
    }
});

module.exports = mongoose.model('Room', Room);