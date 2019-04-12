exports.getHistory = function (req, res) {
    res.render('history.ejs', {
        user: req.session.user,
        logged: true
    });
}