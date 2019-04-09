const express = require("express");
const router = express.Router();
const users = require('../controllers/user');
const itinerary = require('../controllers/itinerary');

router.get('/itinerary', itinerary.getItinerary);
router.get('*', function(req,res){
    res.status(404).json({"message": "Ce chemin n'est pas empruntable sergent ! Vous faites fausse route", "error": true})
});

module.exports = router;