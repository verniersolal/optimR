const api_id = require('../../optimr/config/api_key').api_id;
const api_code = require('../../optimr/config/api_key').api_code;
const request = require('ajax-request');


exports.getMap = function(req,res){
    res.render('leaflet.ejs');
}

exports.getItinerary = function(req, res){
    if(req.method=='GET'){
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
    },function(err1, result1, body1){

        if(err1){return res.status(400).json({'message': err1, 'error': true})}
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
        },function(err2, result2, body2){

            if(err2){return res.status(400).json({'message': err2, 'error': true})}
            let Position2 = JSON.parse(body2).Response.View[0].Result[0].Location.DisplayPosition;

            request({
                url: 'https://route.api.here.com/routing/7.2/calculateroute.json',
                type: 'GET',
                dataType: 'jsonp',
                jsonp: 'jsoncallback',
                data: {
                    waypoint0: Position1.Latitude+','+ Position1.Longitude,
                    waypoint1: Position2.Latitude+','+ Position2.Longitude,
                    mode: 'fastest;publicTransport',
                    app_id: api_id,
                    app_code: api_code,
                    departure: 'now',
                    language:'fr-fr'
                }
            }, function(err3, result3, body3){
                let maneuver = JSON.parse(body3).response.route[0].leg[0].maneuver;
                let data = [];
                for(let i=0; i < maneuver.length; i++) {
                    maneuver[i].instruction = maneuver[i].instruction.replace(/(<([^>]+)>)/ig, "");
                }
                res.render('leaflet.ejs', { data: maneuver});

            });

        });
    });

};