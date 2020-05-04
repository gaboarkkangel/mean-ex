// models/Ejemplar.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');

let ejemplarSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: 'el nombre del ejemplar es obligatorio'
    },
    sexo: {
        type: String,
        required: 'el sexo del ejemplar es obligatorio'
    },
    fnac : {
        type: Date,
        required: 'la fecha de nacimiento del ejemplar es obligatoria'
    },
    nacionality : {
        type : String
    },
    flag : {
        type : String
    }
}, {
    collection: 'ejemplares'
})

ejemplarSchema.plugin(uniqueValidator, { message: 'nombre del ejemplar ya existe.' });
module.exports = mongoose.model('Ejemplar', ejemplarSchema);