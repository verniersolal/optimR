const api_id = require('../config/api_key').api_id;
const api_code = require('../config/api_key').api_code;
const request = require('ajax-request');


exports.getItinerary = function(req, res){
    if(req.method=='GET'){
        return res.render('test.ejs', { data: JSON.stringify('data')});
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
            res.render('test.ejs', { pointA: Position1, pointB: Position2});

        });


    });

};


exports.getPointA = function(req,res,next){

}