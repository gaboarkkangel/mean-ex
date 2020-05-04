const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Carrera = mongoose.model('Carrera');
const Hipodromo = mongoose.model('Hipodromo');
const Polla = mongoose.model('Polla');


let jornadaSchema = new Schema({
    hipodromo: {
        type: Schema.ObjectId, 
        ref: "Hipodromo",
        unique: false,
        required: 'hipodromo es requerido'
    },
    fecha: {
        type: Date, 
        required: 'el nombre del entrenador es requerido'
    },
    carrera: [{
        type: Schema.ObjectId, 
        ref: "Carrera",
    }],
    status : {
        type : String,
        default : "0"
    },
    polla : {
        type: Schema.ObjectId,
        ref: "Polla",
    }
}, {
    collection: 'jornadas'
});

module.exports = mongoose.model('Jornada', jornadaSchema);