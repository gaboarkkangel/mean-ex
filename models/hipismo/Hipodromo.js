// models/Hipodromo.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let hipodromoSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'el nombre del Hipodromo es obligatorio'
    },
    city: {
        type: String,
    },
    state: {
        type: String,
    },
    country: {
        type: String,
    },
    address: {
        type: String,
    },
    metrica : {
        type: String,
        required: 'la métrica es requerida'
    }
}, {
    collection: 'hipodromos'
})

hipodromoSchema.plugin(uniqueValidator, { message: 'Nombre del hipodromo ya existe.' });
module.exports = mongoose.model('Hipodromo', hipodromoSchema);