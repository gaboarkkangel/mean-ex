// models/Jinete.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let jineteSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'el nombre del Jinete es obligatorio'
    },
    nationality: {
        type: String,
    },
    flag : {
    	type : String
    }
}, {
    collection: 'jinetes'
});

jineteSchema.plugin(uniqueValidator, { message: 'nombre del jinete ya existe.' });
module.exports = mongoose.model('Jinete', jineteSchema);