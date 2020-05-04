// models/Inscrito.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let inscritoSchema = new Schema({
    prueba: {
        type: String
    }
}, {
    collection: 'inscritos'
});

inscritoSchema.plugin(uniqueValidator, { message: 'name already in use.' });
module.exports = mongoose.model('Inscrito', inscritoSchema);