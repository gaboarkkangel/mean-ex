// models/Hipodromo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let entrenadorSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'el nombre del Entrenador es obligatorio'
    },
    nationality: {
        type: String,
    },
    flag : {
    	type: String
    }
}, {
    collection: 'entrenadores'
});

entrenadorSchema.plugin(uniqueValidator, { message: 'Nombre del entrenador ya existe.' });
module.exports = mongoose.model('Entrenador', entrenadorSchema);