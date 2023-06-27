const mongoose = require('mongoose')
const { Schema } = mongoose;

const UserSchema = new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true
    },
    Password:{
        type:String,
        required:true
    },
    Date:{
        type:Date,
        default:Date.now
    }
});
const user = mongoose.model('user',UserSchema)
module.exports = user