const sequelize = require('../models/index').sequelize;

exports.getHistory = function (req, res) {
    let query = `SELECT trajetid,MAX(departure) AS departure,MAX(finish)AS finish,sum(distance) AS distance,sum(duration) AS duration ,
        sum(score) AS score,sum(calories) AS calories,sum(co2) AS co2, sum(no2) AS no2,
        sum(pm10) AS pm10,sum(price) AS price
    FROM "trajet"
    WHERE email = '${req.session.user.email}' GROUP BY trajetid ORDER BY sum(distance) DESC`;
    sequelize.query(query, {type: sequelize.QueryTypes.SELECT})
        .then((resp) => {
            console.log("ALL TRAJECTS", resp);
            res.locals.trajets = resp;
            res.render('history.ejs', {
                user: req.session.user,
                logged: true
            });
        })
}