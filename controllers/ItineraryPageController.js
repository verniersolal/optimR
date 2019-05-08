const api_id = require('../config/api_key').api_id;
const api_code = require('../config/api_key').api_code;
const trajet = require('../models/index').trajet;


const oilPrice = 1.467,
    ratio1L100Km = 7.3;
exports.import = function (req, res) {
    trajet.max('trajetid').then(maxValue => {
        if (isNaN(maxValue)) {
            maxValue = 0;
            for (var i = 0; i < data.length; i++) {
                data[i]['trajetid'] = 0;
            }

        } else {
            for (var i = 0; i < data.length; i++) {
                data[i]['trajetid'] = maxValue + 1;
            }
        }

    }).then(() => {
        data.forEach((d) => {
            d.email = req.session.user.email;
            d.departure = req.session.lastTrajet.departure;
            d.finish = req.session.lastTrajet.finish;
        });
        res.json(data);
        for (var i = 0; i < data.length; i++) {
            trajet.create(data[i]).then(() => {
            }).catch(err => {
                console.error(err);
            });
        }
    });
};

exports.maneuverToPath = function(req,res, next){
    //this function take the maneuver array and transform it to an array of path with including different parameter like co2 or no2.
    let path = [];
    let maneuver = req.body;
    maneuver.forEach(function(m,i){
        if(i  !== maneuver.length-1) {
            path.push({
                departure_time: maneuver[maneuver.length - 1].departure_time,
                distance: m.length,
                duration: m.travelTime,
                price: getPrice(getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type), m.length),
                transport_type: getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type),
                position: m.position,
                co2Rate: getCo2Rate(getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type), m.length),
                no2Rate: getNo2Rate(getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type), m.length),
                pm10Rate: getPm10Rate(getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type), m.length),
                caloriesBurned: getCaloriesBurned(getTransportType(m.instruction, maneuver[maneuver.length - 1].transport_type), m.travelTime),
                step: i

            });
        }
    });
    req.pathArray = path;
    next();
};


function getPm10Rate(transport, distance){
    return (transport === 'voiture') ? 0.0138 * distance : ((transport === 'bus') ? 0.02 * distance : 0);
}
//this function returns travelling expenses in euros
function getPrice(transportType, distance){
    return (transportType === 'voiture') ? (oilPrice * ratio1L100Km * (distance/1000))/100 : ((transportType === 'bus' || transportType === 'tram') ? 1.6 : 0);
}

function getNo2Rate(transport, distance) {
    return (transport === 'voiture') ? 0.001 * (distance/1000) : ((transport === 'bus') ? 0.002 * (distance/1000) : 0);

}

function getCo2Rate(transport, distance) {
    return (transport === 'voiture') ? 127 * (distance/1000) : ((transport === 'bus') ? 75 * (distance/1000) : ((transport=== 'tram') ? 23* (distance/1000) : 0));
}

function getCaloriesBurned(transport, duration) {

    return (transport === 'piéton') ? (duration*213)/3600 : ((transport === 'velo') ? (duration*369) / 3600 : 0);

}

function getTransportType(text, transp) {
    return ((text.includes('>rail<') ? 'tram' : ((text.includes('>bus<')) ? 'bus' : (transp==='car') ? 'voiture' : (( transp==='bicycle') ? 'velo' : 'piéton'))))
}

// this complex function is created for aggregate same transport type step in path into one
exports.aggregatePath = function aggregatePath(req,res,next){
    let path = req.pathArray;
    let data = [];
    var sumDistance = 0;
    var sumDuration = 0;
    var sumPrice = 0;
    var sumCo2 = 0.0;
    var sumNo2 = 0;
    var sumPm10 = 0;
    var sumCalories = 0;
    var current_transport = path[0].transport_type;
    var step = 1;
    var first_longitude = path[0].position.longitude;
    var first_latitude = path[0].position.latitude;
    var compteur = 0;
    let lgta = 0;
    let lata = 0;
    path.forEach((t, i) => {
        if ((t.transport_type !== current_transport) || (i === path.length-1)) {// nouveau step
            if(((t.transport_type !== current_transport))){
                lgta = t.longitude;
                lata = t.latitude;
            }
            if (step === 1) {
                data.push({
                    distance: sumDistance,
                    transport_type: current_transport,
                    duration: sumDuration,
                    co2Rate: sumCo2.toFixed(3),
                    caloriesBurned: sumCalories.toFixed(3),
                    no2Rate: sumNo2.toFixed(3),
                    pm10Rate: sumPm10.toFixed(3),
                    price: sumPrice.toFixed(1),
                    longitude: first_longitude,
                    latitude: first_latitude,
                    departure_time: t.departure_time,
                    step: step,
                });

            } else {
                if(i === path.length-1){
                    data.push({
                        distance: sumDistance,
                        transport_type: current_transport,
                        duration: sumDuration,
                        co2Rate: sumCo2.toFixed(3),
                        caloriesBurned: sumCalories.toFixed(3),
                        no2Rate: sumNo2.toFixed(3),
                        pm10Rate: sumPm10.toFixed(3),
                        price: sumPrice.toFixed(1),
                        longitude: first_longitude,
                        latitude: first_latitude,
                        departure_time: t.departure_time,
                        step: step,
                        latb: t.position.latitude,
                        latb: t.position.longitude
                    });
                }else{
                    data.push({
                        distance: sumDistance,
                        transport_type: current_transport,
                        duration: sumDuration,
                        co2Rate: sumCo2.toFixed(3),
                        caloriesBurned: sumCalories.toFixed(3),
                        no2Rate: sumNo2.toFixed(3),
                        pm10Rate: sumPm10.toFixed(3),
                        price: sumPrice.toFixed(1),
                        longitude: first_longitude,
                        latitude: first_latitude,
                        departure_time: t.departure_time,
                        step: step,
                    });
                }
            }
            compteur = 0;

            step++;
            current_transport = t.transport_type;
            sumDistance = parseInt(t.distance);
            sumDuration = parseInt(t.duration);
            sumCo2 = parseFloat(t.co2Rate);
            sumCalories = parseFloat(t.caloriesBurned);
            sumNo2 = parseFloat(t.no2Rate);
            sumPm10 = parseFloat(t.pm10Rate);
            sumPrice = parseFloat(t.price);
            first_longitude = t.position.longitude;
            first_latitude = t.position.latitude;
        } else { // aliment le step
            compteur++;
            sumDistance = sumDistance + parseInt(t.distance);
            sumDuration = sumDuration + parseInt(t.duration);
            sumCo2 = sumCo2 + parseFloat(t.co2Rate);
            sumCalories = sumCalories + parseFloat(t.caloriesBurned);
            sumNo2 = sumNo2 + parseFloat(t.no2Rate);
            sumPm10 = sumPm10 + parseFloat(t.pm10Rate);
            sumPrice = sumPrice + parseFloat(t.price);
        }

    });
    var groupBy = function(xs, key) {
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    };
    var groups = groupBy(path, 'transport_type');
    if(Object.keys(groups).length === 1){
        data[0].lgtb = path[path.length-1].position.longitude;
        data[0].latb = path[path.length-1].position.latitude;

    }
    for (var i = 0; i + 1 < data.length; i++) {
        data[i]['lgtb'] = data[i + 1].longitude;
        data[i]['latb'] = data[i + 1].latitude;
    }
    req.data = data;
    next();
};
exports.calculateScore = function(req,res){
    let data = req.data;
    for (let i = 0; i < data.length; i++) {
        var score;
        switch (data[i]['transport_type']) {
            case 'voiture':
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
            case 'velo':
                score = ((data[i]['distance']) * (9.5 + 7)) / data[i]['duration'];
                break;
            case 'piéton':
                score = ((data[i]['distance']) * (12 + 8)) / data[i]['duration'];
                break;
        }
        data[i]['score'] = Math.floor(score);
    }
    return res.json(data);
};

exports.getData = function (req, res) {
    trajet.max('trajetid').then(maxValue =>{
        if(!isNaN(maxValue)){
            trajet.findAll({
                where:{
                    trajetid: maxValue
                }
            }).then(result =>{
                res.json(result);
            })
        }
    })
    //recuperer le dernier trajet et retourner sous forme de json
};

exports.getItinerary = function(req,res){
    res.render('itinerary2.ejs', {api_id: 'nrrONwSooNB8h5ESY50e', api_code: 'AkcUfAszo101WuKLwdMeYA'});
};

exports.getApiKey = function(req,res){
    res.json({api_id: api_id, api_code:api_code });
    /*
        test if user is connected
        if(typeof req.session.user.email != 'undefined'){
        }
    */
}