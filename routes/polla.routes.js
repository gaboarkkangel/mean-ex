// routes/auth.routes.js

const express = require("express");
const router = express.Router();
const pollaSchema = require("../models/hipismo/Polla");

const PATH_POLLAS = "/pollas";
// Get Users
router.route(PATH_POLLAS).get((req, res) => {
    pollaSchema.find((error, response) => {
        if (error) {
            return next(error)
        } else {
            res.status(200).json(response)
        }
    })
});

module.exports = router;