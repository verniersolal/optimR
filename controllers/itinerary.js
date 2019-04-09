const api_id = require('../../optimr/config/api_key').api_id;
const api_code = require('../../optimr/config/api_key').api_code;
const request = require('ajax-request');
const ejs = require('ejs');
exports.getItinerary = function(req, res){
    request({
        url: 'https://geocoder.api.here.com/6.2/geocode.json',
        type: 'GET',
        dataType: 'jsonp',
        jsonp: 'jsoncallback',
        data: {
            searchtext: '200 S Mathilda Sunnyvale CA',
            app_id: 'nrrONwSooNB8h5ESY50e',
            app_code: 'AkcUfAszo101WuKLwdMeYA',
            gen: '9'
        }
    },function(err, result, body){
        res.render('index.ejs', { data:body });

    });

};