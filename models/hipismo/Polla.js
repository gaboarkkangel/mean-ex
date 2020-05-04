
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const pollaCombinacion = mongoose.model('PollaCombinacion');

let pollaSchema = new Schema({
    pollaCombinaciones: [{
            type: Schema.ObjectId, 
            ref: "pollaCombinacion",
        }],
    status: {
        type: String,
        default : '1'
    },
    visible : {
    	type: String,
        default : '1'
    }
}, {
    collection: 'pollas'
})

module.exports = mongoose.model('Polla', pollaSchema);