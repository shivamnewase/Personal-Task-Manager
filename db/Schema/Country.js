const mongoose = require("mongoose");


const countrySchema = new mongoose.Schema({
    name: {type:String, unique:true, required: true},
    code: {type:String, unique:true, required: true},
    language:String,
    currencies:String
    
})

module.exports = mongoose.model("Country", countrySchema)