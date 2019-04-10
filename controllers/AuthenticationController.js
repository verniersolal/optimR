const user = require('../models/index').user;
const bcrypt = require('bcrypt');

exports.login = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    user.findOne({
        where: {
            email: email,
        },
        attributes: ['email', 'password']
    }).then((resp) => {
        if (resp) {
            console.log("success", resp.dataValues.password);
            let realPasswd = resp.dataValues.password;
            console.log(password, realPasswd);
            if (bcrypt.compareSync(password, realPasswd)) {
                console.log("same");
                req.session.user = {email, password};
                res.locals.user = req.session.user;
                res.render('index.ejs', {user: req.session.user});
            } else {
                console.log("different");
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
            req.session.user = {email, password};
            res.locals.user = req.session.user;
            res.render('index.ejs', {user: req.session.user});
        } else {
            console.log("User has not correctly been created...");
            res.render('index.ejs', {user: req.session.user});
        }
    }).catch((e) => {
        console.error(e);
    });
}