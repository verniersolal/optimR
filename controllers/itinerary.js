const api_id = require('../config/api_key').api_id;
const api_code = require('../config/api_key').api_code;
const request = require('ajax-request');
const trajet = require('../models/index').trajet;

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

exports.import = function(req,res){
    let data = [];
    for(let i = 0; i+1< req.body.trajets.length; i++){

        req.body.trajets[i]['latb'] =req.body.trajets[i+1]['lata'];
        req.body.trajets[i]['lgtb'] =req.body.trajets[i+1]['lgta'];
        data.push(req.body.trajets[i]);
    }
    trajet.max('trajetid').then(maxValue =>{
        if(isNaN(maxValue)){
            for(var i =0; i<data.length;i++){
                data[i]['trajetid'] = 0;
            }
        }else{
            for(var i =0; i<data.length;i++){
                data[i]['trajetid'] = maxValue+1;
            }
        }
    }).then(() => {
        for(var i =0; i<data.length;i++){
            trajet.create(data[i]).then(()=>{}).catch(err =>{console.error(err);})
        }
    });

    res.json('toto');
};