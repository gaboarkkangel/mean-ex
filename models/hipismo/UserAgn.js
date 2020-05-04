// models/UserAgn.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let useragnSchema = new Schema({
    username : {
        type: String
        unique: true
    },
    active : {
        type : Number
    }
}, {
    collection: 'useragns'
})

useragnSchema.plugin(uniqueValidator, { message: 'Email or username already in use.' });
module.exports = mongoose.model('UserAgn', useragnSchema);