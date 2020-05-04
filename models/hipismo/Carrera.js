// models/Jinete.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const uniqueValidator = require('mongoose-unique-validator');
var Participante = mongoose.model('Participante');


let carreraSchema = new Schema({
    cod: {
        type: String,
        unique: true,
        required: 'el código de la carrera es requerido'
    },
    numero: {
        type: Number,
        required: 'el número de la carrera es requerido'
    },
    is_val: {
    	type : Number,
    	required : 'is_val es requerido'
    },
    val_num : {
        type : Number
    },
    distancia : {
    	type : Number,
    	required : 'la distancia es requerida'
    },
    hora : {
    	type : Date,
    	required : 'la hora es requerida'
    },
    participantes : [{
        type: Schema.Types.ObjectId,
        ref: "Participante"
    }],
    status : {
        type : String,
        required : 'el estado es requerido',
        default : "0"
    },
    parentJornada : {
        type : String,
        required : 'el id de la jornada es requerido'
    },
    surface : {
        type : String,
        required : 'El tipo de Superfice es requerida'
    },
    result : {
        type : String,
        default : '0'
    }
}, {
    collection: 'carreras'
});

carreraSchema.plugin(uniqueValidator, { message: 'name already in use.' });
module.exports = mongoose.model('Carrera', carreraSchema);