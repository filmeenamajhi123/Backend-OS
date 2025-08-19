const mongoose = require('mongoose');

const dataSechma = new mongoose.Schema({
    username: {
        required : true,
        type: String
    },
    email : {
        required : true,
        unique : true,
        type : String
    },
    password : {
        required : true,
        type : String
    }
})

module.exports = mongoose.model('Data', dataSechma);