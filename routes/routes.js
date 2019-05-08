const express = require("express");
const router = express.Router();
const itinerary = require('../controllers/ItineraryPageController');
const homepage = require('../controllers/HomePageController');
const auth = require('../controllers/AuthenticationController');
const profile = require('../controllers/ProfileController');
const community = require('../controllers/CommunityController');
const donation = require('../controllers/DonationController');
const history = require('../controllers/HistoryController');

// Itinerary
router.get('/itinerary', itinerary.getItinerary);
router.post('/itinerary', itinerary.getItinerary);
router.get('/getData', itinerary.getData);
router.get('/getKeys', itinerary.getApiKey);
 router.post('/maneuverToPath', itinerary.maneuverToPath, itinerary.aggregatePath, itinerary.calculateScore);

router.post('/import', itinerary.import);
router.get('/', homepage.getHomePage);
// Auth
router.post('/login', auth.login);
router.get('/logout', auth.logout);
router.get('/signup', auth.signup);
router.post('/signin', auth.sigin);
router.get('/logged', auth.logged);
// Profile
router.get('/profile', profile.getProfile);
router.post('/infos', profile.saveInfos);
// Community
router.get('/community', community.getCommunity);
router.post('/follow', community.follow);
router.post('/unfollow', community.unfollow);
// Get current user
router.get('/getCurrentUser', auth.getCurrentUser);
// Donation
router.get('/donation', donation.getDonation);
// Historique
router.get('/history', history.getHistory);
// Fauses pages
router.get('/defi', function (req, res) {
    res.render('defi.ejs', {logged: true, user: req.session.user});
})
router.get('*', function (req, res) {
    res.status(404).json({
        "message": "Ce chemin n'est pas empruntable sergent ! Vous faites fausse route",
        "error": true
    })
});

module.exports = router;