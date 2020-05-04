
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const usuarios = mongoose.model('User');

let pollaCombinacionSchema = new Schema({
    usuario: {
        type: Schema.ObjectId, 
        ref: "usuarios",
        required: 'el usrio es requerido'
    },
    combinaciones: [{
            type: Number,
            required: 'la combinacion de la jugada es requerida'
        }],
    username : {
        type : String,
        required : 'el nombre de usuario es requerido'
    }
}, {
    collection: 'pollasCombinaciones'
})

module.exports = mongoose.model('PollaCombinacion', pollaCombinacionSchema);