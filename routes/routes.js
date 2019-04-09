const express = require("express");
const router = express.Router();
const itinerary = require('../controllers/itinerary');

router.post('/itinerary/', itinerary.getItinerary);
router.get('/itinerary/', itinerary.getItinerary);
router.post('/map', itinerary.getMap);
router.get('*', function(req,res){
    res.status(404).json({"message": "Ce chemin n'est pas empruntable sergent ! Vous faites fausse route", "error": true})
});

module.exports = router;