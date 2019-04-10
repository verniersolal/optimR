exports.getHomePage = function (req, res) {
    res.render('index.ejs', {user: req.session.user});
}