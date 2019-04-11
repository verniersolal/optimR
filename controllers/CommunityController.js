const user = require('../models/index').user;
const follow = require('../models/index').follow;
const sequelize = require('../models/index').sequelize;

exports.getCommunity = function (req, res) {
    let email = req.session.user.email;
    sequelize.query(`SELECT "email","username", "points", "sex" FROM "user" AS "user" JOIN follow f on f.follow_email= "user".email WHERE f."user_email" = '${email}' ORDER BY "user".points DESC`, {type: sequelize.QueryTypes.SELECT})
        .then((resp) => {
            res.locals.follows = resp;
            sequelize.query('SELECT "email","username","points","sex" FROM "user" ORDER BY "user".points DESC', {type: sequelize.QueryTypes.SELECT})
                .then((resp) => {
                    res.locals.users = resp;
                    res.locals.users.forEach((u, i) => {
                        res.locals.follows.forEach((f) => {
                            if (JSON.stringify(u) === JSON.stringify(f)) {
                                f.rank = i;
                                u.followed = true;
                            }
                        })
                    });
                    console.log(res.locals.follows);
                    res.render('community.ejs', {
                        user: req.session.user,
                        logged: true,
                    });
                })
        }).catch(e =>
        console.log(e)
    )
}

exports.follow = function (req, res) {
    follow.create({user_email: req.body.email, follow_email: req.body.user_to_follow}).then((resp) => {
        if (resp) {
            res.json(resp);
        } else {
            res.redirect('/optimr/profile');
        }
    }).catch((e) => {
        console.error(e);
    });
}

exports.unfollow = function (req, res) {
    console.log("POST UNFOLLOW", req.body);
    follow.destroy({
        where: {
            user_email: req.body.email,
            follow_email: req.body.user_to_unfollow
        }
    }).then((resp) => {
        res.json(resp);
    }).catch(e => console.log(e));
}