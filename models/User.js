// models/User.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let userSchema = new Schema({
    name: {
        type: String
    },
    username : {
        type: String,
        unique: true
    },
    email: {
        type: String,
        unique: true
    },
    password: {
        type: String
    },
    f_ini: {
        type: Date 
    },
    f_nac: {
        type: Date 
    },
    rol : {
        type : String
    },
    avatar : {
        type : String
    }
}, {
    collection: 'users'
})

userSchema.plugin(uniqueValidator, { message: 'Email or username already in use.' });
module.exports = mongoose.model('User', userSchema);