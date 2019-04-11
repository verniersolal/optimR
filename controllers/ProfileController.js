const user = require('../models/index').user;
const stepLevels = require('../config/step_level').stepLevels;

exports.getProfile = function (req, res) {
    res.render('profile.ejs', {
        user: req.session.user,
        logged: true,
        rateLevel: exports.getRateLevel(req, req.session.user.points)
    });
}

exports.getRateLevel = function (req, points) {
    let stepLevel = exports.getStepLevel(req);
    return (points / stepLevel) * 100;
}

exports.getStepLevel = function (req) {
    if (req.session.user.level !== 3) {
        return stepLevels[req.session.user.level];
    } else {
        return stepLevels[2];
    }
}

exports.saveInfos = function (req, res) {
    let sex = req.body.sex;
    let weight = req.body.weight;
    if (sex === "") sex = null;
    if (weight === "") weight = null;
    user.update(
        {sex: sex, weight: weight},
        {where: {email: req.session.user.email}}
    ).then(result => {
            console.log("USER CORRECTLY UPDATED", result);
            res.render('profile.ejs', {
                logged: true,
                user: req.session.user,
                rateLevel: exports.getRateLevel(req, req.session.user.points),
                saved: true
            });
        }
    ).catch(err =>
        console.log(err)
    )
}