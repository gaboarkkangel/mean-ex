const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var Ejemplar = mongoose.model('Ejemplar');
var Entrenador = mongoose.model('Entrenador');
var Jinete = mongoose.model('Jinete');

let participanteSchema = new Schema({
    ejemplar: {
        type: Schema.ObjectId, 
        ref: "Ejemplar",
        unique: false,
        required: 'el nombre del ejemplar es requerido'
    },
    entrenador: {
        type: Schema.ObjectId, 
        ref: "Entrenador",
        unique: false,
        required: 'el nombre del entrenador es requerido'
    },
    jinete: {
        type: Schema.ObjectId, 
        ref: "Jinete",
        unique: false,
        required: 'el nombre del Jinete es requerido'
    },
    numero : {
        type : Number,
        required: 'el número del ejemplar es requerido'
    },
    pp : {
        type : Number,
        required: 'el puesto de partida es requerido'
    },
    status : {
        type : Number,
        default : 1
    },
    parentCarrera : {
        type : String,
        required : 'el id de la jornada es requerido'
    },
    position : {
        type : String
    },
    cps : {
        type : String
    },
    timeHorse : {
        type : String
    },
    timeWinner : {
        type : String
    }
}, {
    collection: 'participantes'
});

module.exports = mongoose.model('Participante', participanteSchema);