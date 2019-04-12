exports.getDonation = function (req, res) {
    res.render('donation.ejs', {
        user: req.session.user,
        logged: true
    });
}