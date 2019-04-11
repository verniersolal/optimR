exports.getHomePage = function (req, res) {
    if(req.session.logged) {
        res.redirect('/optimr/profile');
    }else{
        res.render('index.ejs', {user: req.session.user});
    }
}