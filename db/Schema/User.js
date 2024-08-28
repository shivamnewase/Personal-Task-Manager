const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name: String,
    email: {type:String, required: true, unique: true },
    password: {type:String, required: true},
    role: String,
    phone: String,
    status: String,

})

module.exports = mongoose.model('User', userSchema)