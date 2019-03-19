const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {type:String, trim:true, required:true} //TODO ROOM, lastest read
})

module.exports = mongoose.model('User', UserSchema);