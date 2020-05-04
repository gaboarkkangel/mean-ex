// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const pollaCombinacionSchema = require("../models/hipismo/PollaCombinacion");
const pollaSchema = require('../models/hipismo/Polla');
const userSchema = require('../models/User');
const PATH_POLLASCOMBINACION = "/pollasCombinaciones";
// Get Users
router.route(PATH_POLLASCOMBINACION).get((req, res) => {
    pollaCombinacionSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

//Guardar Polla combinacion y set en hipodromo

router.post(PATH_POLLASCOMBINACION,(req, res, next) => {

    	let pollaId = req.body.polla;
    	let query = {"_id": pollaId};
    	let username;
    	userSchema.findById(req.body.user, (error, user)=> {
    		if(error){
    			return next(error);
    		} else {
    			username = user.username;

    			const pollaCombinacion = new pollaCombinacionSchema({
		        usuario : req.body.user,
		        combinaciones : req.body.combinaciones,
		        username
		    	});

		        console.log(pollaCombinacion);

		        pollaSchema.findById(pollaId, (error, data) => {
		        	if(error){
		        		return next(error);
		        	} else {

		        		let combinaciones = data.pollaCombinaciones;
		        		combinaciones.push(pollaCombinacion._id);

		        		pollaCombinacion.save().then((response) => {

		        			pollaSchema.updateOne(query,
					    	{ 
					    		$set : { "pollaCombinaciones" : combinaciones}
					    	}, (error, update) => {
						        if (error) {
						            return next(error);
						            console.log(error)
						        } else {
						            res.json({
						            	data : update, 
						            	id : pollaId,
						            	msg : 'Ticket creado. Su combinación se realizó con éxito !!'
						            });
						            console.log('Ticket creado. Su combinación se realizó con éxito !!');
						        }
						    });
		        		}).catch(error => {
					        res.status(500).json({
					            error: error
					        });
					    });
        			}
        		});
    		}
    	});

        
});

module.exports = router;