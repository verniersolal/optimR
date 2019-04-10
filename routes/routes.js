const express = require("express");
const router = express.Router();
const itinerary = require('../controllers/itinerary');
const homepage = require('../controllers/HomePageController');
const auth = require('../controllers/AuthenticationController');
router.get('/itinerary', itinerary.getItinerary);
router.get('/', homepage.getHomePage);
// Auth
router.post('/login',auth.login);
router.get('/logout',auth.logout);
router.get('/signup',auth.signup);
router.post('/signin',auth.sigin);
router.get('*', function (req, res) {
    res.status(404).json({
        "message": "Ce chemin n'est pas empruntable sergent ! Vous faites fausse route",
        "error": true
    })
});

module.exports = router;