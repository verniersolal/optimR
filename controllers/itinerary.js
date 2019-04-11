const api_id = require('../config/api_key').api_id;
const api_code = require('../config/api_key').api_code;
const request = require('ajax-request');
const trajet = require('../models/index').trajet;

exports.getItinerary = function (req, res) {
    if (req.method === 'GET') {
        return res.render('itinerary.ejs', {
            data: JSON.stringify('data'), user: req.session.user,
            logged: true
        });
    }
}
exports.getItinerary = function(req, res){
    if(req.method==='GET'){
        return res.render('itinerary.ejs', { data: JSON.stringify('data')});
    }
    request({
        url: 'https://geocoder.api.here.com/6.2/geocode.json',
        type: 'GET',
        dataType: 'json',
        data: {
            searchtext: req.body.departure,
            app_id: api_id,
            app_code: api_code,
            gen: '9'
        }
    }, function (err1, result1, body1) {

        if (err1) {
            return res.status(400).json({'message': err1, 'error': true})
        }
        let Position1 = JSON.parse(body1).Response.View[0].Result[0].Location.DisplayPosition;
        request({
            url: 'https://geocoder.api.here.com/6.2/geocode.json',
            type: 'GET',
            dataType: 'json',
            data: {
                searchtext: req.body.finish,
                app_id: api_id,
                app_code: api_code,
                gen: '9'
            }
        }, function (err2, result2, body2) {

            if (err2) {
                return res.status(400).json({'message': err2, 'error': true})
            }
            let Position2 = JSON.parse(body2).Response.View[0].Result[0].Location.DisplayPosition;
            res.render('itinerary.ejs', { pointA: Position1, pointB: Position2});

            res.render('itinerary.ejs',
                {
                    pointA: Position1, pointB: Position2, user: req.session.user,
                    logged: true,
                });
        });


    });

};
exports.import = function(req,res){
    let data = [];
    var sumDistance =0;
    var sumDuration = 0;
    var sumPrice = 0;
    var sumCo2 = 0.0;
    var sumNo2 = 0;
    var sumPm10 = 0;
    var sumCalories = 0;
    var current_transport = req.body.trajets[0].transport_type;
    var step = 1;
    var first_lgta = req.body.trajets[0].lgta;
    var first_lata = req.body.trajets[0].lata;
    var compteur = 0;
    req.body.trajets.forEach((t, i)=>{
        if((t.transport_type !== current_transport)) {// nouveau step
            if(step===1){
                data.push({
                    distance: sumDistance,
                    transport_type: current_transport,
                    duration: sumDuration,
                    co2: sumCo2,
                    calories: sumCalories,
                    no2: sumNo2,
                    pm10: sumPm10,
                    price: sumPrice,
                    lgta: first_lgta,
                    lata: first_lata,
                    departure_time: t.departure_time,
                    step: step,
                });
            }else {
                data.push({
                    distance: sumDistance,
                    transport_type: current_transport,
                    duration: sumDuration,
                    co2: sumCo2,
                    calories: sumCalories,
                    no2: sumNo2,
                    pm10: sumPm10,
                    price: sumPrice,
                    lgta: req.body.trajets[i - compteur-1].lgta,
                    lata: req.body.trajets[i - compteur-1].lata,
                    departure_time: t.departure_time,
                    step: step,
                });
            }
            compteur = 0;

            step++;
            current_transport = t.transport_type;
            sumDistance = parseInt(t.distance);
            sumDuration = parseInt(t.duration);
            sumCo2 = parseFloat(t.co2);
            sumCalories =  parseFloat(t.calories);
            sumNo2 =  parseFloat(t.no2);
            sumPm10 = parseFloat(t.pm10);
            sumPrice =  parseFloat(t.price);
        } else{ // aliment le step
            compteur++;
            sumDistance = sumDistance+ parseInt(t.distance);
            sumDuration = sumDuration+ parseInt(t.duration);
            sumCo2 = sumCo2+ parseFloat(t.co2);
            sumCalories = sumCalories+ parseFloat(t.calories);
            sumNo2 = sumNo2+ parseFloat(t.no2);
            sumPm10 = sumPm10+ parseFloat(t.pm10);
            sumPrice = sumPrice+ parseFloat(t.price);
        }

    });
    if(req.body.trajets[req.body.trajets.length-1].transport_type === current_transport){
        data.push({
            distance: sumDistance,
            transport_type: current_transport,
            duration: sumDuration,
            co2: sumCo2,
            calories: sumCalories,
            no2: sumNo2,
            pm10: sumPm10,
            price: sumPrice,
            lgta: req.body.trajets[req.body.trajets.length-1-compteur].lgta,
            lata: req.body.trajets[req.body.trajets.length-1-compteur].lata,
            departure_time: req.body.trajets[req.body.trajets.length-1].departure_time,
            step: step,
        })
    }else{

        data.push({
            distance: sumDistance,
            transport_type: current_transport,
            duration: sumDuration,
            co2: sumCo2,
            calories: sumCalories,
            no2: sumNo2,
            pm10: sumPm10,
            price: sumPrice,
            lgta: req.body.trajets[req.body.trajets.length-1-compteur].lgta,
            lata: req.body.trajets[req.body.trajets.length-1-compteur].lata,
            departure_time: req.body.trajets[req.body.trajets.length-1].departure_time,
            step: step,
        });

        step++;
        data.push({
            distance: req.body.trajets[req.body.trajets.length-1].distance,
            transport_type: req.body.trajets[req.body.trajets.length-1].transport_type,
            duration: req.body.trajets[req.body.trajets.length-1].duration,
            co2: req.body.trajets[req.body.trajets.length-1].co2,
            calories: req.body.trajets[req.body.trajets.length-1].calories,
            no2: req.body.trajets[req.body.trajets.length-1].no2,
            pm10: req.body.trajets[req.body.trajets.length-1].pm10,
            price: req.body.trajets[req.body.trajets.length-1].price,
            lgta: req.body.trajets[req.body.trajets.length-1].lgta,
            lata: req.body.trajets[req.body.trajets.length-1].lata,
            departure_time: req.body.trajets[req.body.trajets.length-1].departure_time,
            step: step,
        });
    }
    for(var i =0; i+1 < data.length;i++){
        data[i]['lgtb'] = data[i+1].lgta;
        data[i]['latb'] = data[i+1].lata;
    }
    for(let i=0; i< data.length; i++) {
        var score;
        switch (data[i]['transport_type']) {
            case 'car':
                score = 0;
                break;
            case 'bus':
                score = ((data[i]['distance']) * 3) / data[i]['duration'];
                break;
            case 'tram':
                score = ((data[i]['distance']) * 3) / data[i]['duration'];
                break;
            case 'covoit':
                score = ((data[i]['distance']) * 4.5) / data[i]['duration'];
                break;
            case 'bicycle':
                score = ((data[i]['distance']) * (9.5 + 7)) / data[i]['duration'];
                break;
            case 'piéton':
                score = ((data[i]['distance']) * (12 + 8)) / data[i]['duration'];
                break;
        }
        data[i]['score'] = Math.floor(score);
    }
    trajet.max('trajetid').then(maxValue =>{
        if(isNaN(maxValue)) {
            maxValue = 0;
            for(var i =0; i<data.length;i++) {
                data[i]['trajetid'] = 0;
            }

        }else{
            for(var i =0; i<data.length;i++) {
                data[i]['trajetid'] = maxValue + 1;
            }
        }
        res.json(data);
    }).then(() => {
        for (var i = 0; i < data.length; i++) {
            trajet.create(data[i]).then(() => {
            }).catch(err => {
                console.error(err);
            });
        }
    });
};

exports.getData = function(req,res){
    //recuperer le dernier trajet et retourner sous forme de json
}