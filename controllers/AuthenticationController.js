const user = require('../models/index').user;
const bcrypt = require('bcrypt');
const profile = require('../controllers/ProfileController');

exports.login = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    user.findOne({
        where: {
            email: email,
        },
    }).then((resp) => {
        if (resp) {
            console.log("success", resp.dataValues.password);
            let realPasswd = resp.dataValues.password;
            if (bcrypt.compareSync(password, realPasswd)) {
                req.session.user = resp.dataValues;
                req.session.logged = true;
                res.redirect('/optimr/logged');
            } else {
                console.log("different password... TODO");
            }
        } else {
            console.log("no user found");
        }
    }).catch((e) => {
        console.error(e);
    });
};

exports.logout = function (req, res) {
    req.session.destroy(function () {
        console.log("user logged out.")
    });
    res.redirect('/optimr');
};

exports.signup = function (req, res) {
    res.render('signup.ejs', {user: req.session.user});
}

exports.sigin = function (req, res) {
    let username = req.body.username;
    let email = req.body.email;
    let password = req.body.password;
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    console.log(username, email, hash);
    user.create({username: username, email: email, password: hash}).then((resp) => {
        if (resp) {
            console.log("User has correctly been created !");
            req.session.user = resp.dataValues;
            req.session.logged = true;
            res.redirect('/optimr/logged');
        } else {
            console.log("User has not correctly been created...");
            res.render('index.ejs', {user: req.session.user});
        }
    }).catch((e) => {
        console.error(e);
    });
}

exports.logged = function (req, res) {
    res.locals.login = true;
    res.locals.logged = req.session.logged;
    res.locals.user = req.session.user;
    res.locals.rateLevel = profile.getRateLevel(req, req.session.user.points);
    res.render('profile.ejs');
}

exports.getCurrentUser = function (req, res) {
    res.json(req.session.user);
}