let routeInstructionsContainer = document.getElementById('panel');
function createTable(response) {
    routeInstructionsContainer.innerHTML =
        '<table class=\'responsive-table\' id=\'mytable\'>' +
        '<thead>' +
        '<th>Départ</th>' +
        '<th>Arrivée</th>' +
        '<th>Durée(min)</th>' +
        '<th>Distance (m)</th>' +
        '<th>Taux de CO2(g/km)</th>' +
        '<th>Frais de Déplacement(euros)</th>' +
        '<th>Mode de Transport</th>' +
        '<th>Score</th></thead>';
    let summedScore = 0;
    for (var i = 0; i < response.length; i++) {
        var tr = '<tr data-lata="'+response[i].latitude+'" id="trnb'+i+'" class="tr" data-lgta="'+ response[i].longitude+'"' +
            ' data-latb="'+response[i].latb+'" data-lgtb="'+response[i].lgtb+'">' +
            '<td>' + $('#departure').val() + '</td>' +
            '<td>' + $('#finish').val() + '</td>' +
            '<td>' + response[i].duration + '</td>' +
            '<td>' + response[i].distance + '</td>' +
            '<td>' + response[i].co2Rate + '</td>' +
            '<td>' + response[i].price + '</td>' +
            '<td><div id="transport" class="input-field">\n';
        switch(response[i].transport_type) {
            case 'voiture':
                tr +=
                    '        <select class="icons green-text transportChoices">\n' +
                    '            <option value="car" selected data-icon="../img/voiture.png">Voiture</option>\n' +
                    '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                    '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                    '            <option value="publicTransport" >Transport Public</option>\n' +
                    '        </select>\n' +
                    '    </div></td>';
                break;
            case 'tram':
                tr +=
                    '        <select class="icons green-text transportChoices">\n' +
                    '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                    '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                    '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                    '            <option selected value="publicTransport" >Tram</option>\n' +
                    '        </select>\n' +
                    '    </div></td>';
                break;
            case 'bus':
                tr +=
                    '        <select class="icons green-text transportChoices">\n' +
                    '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                    '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                    '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                    '            <option selected value="publicTransport" >Bus</option>\n' +
                    '        </select>\n' +
                    '    </div></td>';
                break;
            case 'velo':
                tr +=
                    '        <select class="icons green-text transportChoices">\n' +
                    '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                    '            <option value="bicycle" selected data-icon="../img/velo.png">Vélo</option>\n' +
                    '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                    '            <option value="publicTransport" >Transport Public</option>\n' +
                    '        </select>\n' +
                    '    </div></td>';
                break;
            default:
                tr +=
                    '        <select class="icons green-text transportChoices">\n' +
                    '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                    '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                    '            <option value="pedestrian" selected data-icon="../img/pieds.png">Piéton</option>\n' +
                    '            <option value="publicTransport" >Transport Public</option>\n' +
                    '        </select>\n' +
                    '    </div></td>';
                break;
        }
        tr+= '<td>' + response[i].score + '</td></tr>';
        $('#mytable').append(tr);
        summedScore += response[i].score;
    }
    let panel = $('#panel');
    panel.append('<h4 id="totalScore">Score Total : ' + summedScore + '</h4>');
    $('select').formSelect();
    panel.css('display', 'block');
}
$(document).ready(function(){
    //mapContainer is the container div of map
    var mapContainer = document.getElementById('map');
    $.ajax({
        url: '/optimr/getKeys',
        type: 'GET',
        success: mainItinerary
    });
    function mainItinerary(Key){// get keys for connection to api
        var platform = new H.service.Platform({
            app_id: Key.api_id,
            app_code: Key.api_code,
            useHTTPS: true
        });
        var pixelRatio = window.devicePixelRatio || 1;
        var defaultLayers = platform.createDefaultLayers({
            tileSize: pixelRatio === 1 ? 256 : 512,
            ppi: pixelRatio === 1 ? undefined : 320
        });

        mapContainer.style.width = '100%';
        var map = new H.Map(mapContainer,
            defaultLayers.normal.map, {
                center: {lat: 43.60, lng: 3.88},
                zoom: 13,
                pixelRatio: pixelRatio
            });
        //behavior and ui is two functionalities who allow interaction in the map
        var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
        var ui = H.ui.UI.createDefault(map, defaultLayers);

        // on click of search button we call the geocoder function who transform the address to localisation(lat,lgt)
        function geocodeAdress(departure, finish, key) {
            var platform = new H.service.Platform({
                app_id: key.api_id,
                app_code: key.api_code,
                useHTTPS: true
            });
            let departureRequest = $.ajax({
                url: 'https://geocoder.api.here.com/6.2/geocode.json',
                type: 'GET',
                dataType: 'json',
                data: {
                    searchtext: departure,
                    app_id: key.api_id,
                    app_code: key.api_code,
                    gen: '9'
                }
            });
            let finishRequest = $.ajax({
                url: 'https://geocoder.api.here.com/6.2/geocode.json',
                type: 'GET',
                dataType: 'json',
                data: {
                    searchtext: finish,
                    app_id: key.api_id,
                    app_code: key.api_code,
                    gen: '9'
                }
            });
            $.when(departureRequest, finishRequest).then(function (departureResponse, finishResponse) {
                let departurePosition = departureResponse[0].Response.View[0].Result[0].Location.DisplayPosition;
                let finishPosition = finishResponse[0].Response.View[0].Result[0].Location.DisplayPosition;
                var router = platform.getRoutingService(),
                    routeRequestParams = {
                        mode: 'fastest;car',
                        representation: 'display',
                        routeattributes: 'waypoints,summary,shape,legs',
                        maneuverattributes: 'direction,action',
                        waypoint0: departurePosition.Latitude + ',' + departurePosition.Longitude, // Brandenburg Gate
                        waypoint1: finishPosition.Latitude + ',' + finishPosition.Longitude,// Friedrichstraße Railway Station
                        language: 'fr-fr'
                    };
                router.calculateRoute(
                    routeRequestParams,
                    function (response) {
                        let route = response.response.route[0];
                        /**
                         * Creates a H.map.Polyline from the shape of the route and adds it to the map.
                         * @param {Object} route A route as received from the H.service.RoutingService
                         */
                        function addRouteShapeToMap(route) {
                            var lineString = new H.geo.LineString(),
                                routeShape = route.shape,
                                polyline;

                            routeShape.forEach(function (point) {
                                var parts = point.split(',');
                                lineString.pushLatLngAlt(parts[0], parts[1]);
                            });

                            polyline = new H.map.Polyline(lineString, {
                                style: {
                                    lineWidth: 4,
                                    strokeColor: 'rgba(0, 128, 255, 0.7)'
                                }
                            });
                            // Add the polyline to the map
                            map.addObject(polyline);
                            // And zoom to its bounding rectangle
                            map.setViewBounds(polyline.getBounds(), true);
                        }
                        var bubble;
                        function openBubble(position, text) {
                            if (!bubble) {
                                bubble = new H.ui.InfoBubble(
                                    position,
                                    // The FO property holds the province name.
                                    {content: text});
                                ui.addBubble(bubble);
                            } else {
                                bubble.setPosition(position);
                                bubble.setContent(text);
                                bubble.open();
                            }
                        }
                        /**
                         * Creates a series of H.map.Marker points from the route and adds them to the map.
                         * @param {Object} route  A route as received from the H.service.RoutingService
                         */
                        function addManueversToMap(route) {
                            var svgMarkup = '<svg width="18" height="18" ' +
                                'xmlns="http://www.w3.org/2000/svg">' +
                                '<circle cx="8" cy="8" r="8" ' +
                                'fill="#1b468d" stroke="white" stroke-width="1"  />' +
                                '</svg>',
                                dotIcon = new H.map.Icon(svgMarkup, {anchor: {x: 8, y: 8}}),
                                group = new H.map.Group(),
                                i,
                                j;

                            // Add a marker for each maneuver
                            for (i = 0; i < route.leg.length; i += 1) {
                                for (j = 0; j < route.leg[i].maneuver.length; j += 1) {
                                    // Get the next maneuver.
                                    maneuver = route.leg[i].maneuver[j];
                                    // Add a marker to the maneuvers group
                                    var marker = new H.map.Marker({
                                            lat: maneuver.position.Latitude,
                                            lng: maneuver.position.Longitude
                                        },
                                    );
                                    marker.instruction = maneuver.instruction;
                                    group.addObject(marker);
                                }
                            }

                            group.addEventListener('tap', function (evt) {
                                map.setCenter(evt.target.getPosition());
                                openBubble(
                                    evt.target.getPosition(), evt.target.instruction);
                            }, false);

                            // Add the maneuvers group to the map
                            map.addObject(group);
                        }
                        route.leg[0].maneuver.push({
                            'departure_time': response.response.metaInfo.timestamp,
                            transport_type: route.mode.transportModes[0]
                        });
                        $.ajax({
                            url: '/optimr/maneuverToPath',
                            data: JSON.stringify(route.leg[0].maneuver),
                            type:'POST',
                            dataType: 'json',
                            contentType: 'application/json',
                            success: function(response) {

                                createTable(response);
                            }
                        });

                        addRouteShapeToMap(route);
                        addManueversToMap(route);


                    },
                    function (err) {
                        console.error(err);
                    }
                );
            });
        }

        $('#searchBtn').on('click', function (d) {
            $.ajax({
                url: '/optimr/getKeys',
                type: 'GET',
                success: function (Key) {
                    geocodeAdress($('#departure').val(), $('#finish').val(), Key);
                    // on click of search button we call the geocoder function who transform the address to localisation(lat,lgt)
                    // search how we can import a lib with url in node js
                }
            });
        });
    }
});


$(document).on('change', '.transportChoices', {}, function(evt){
    let select = $(evt.target);
    let tr = select.closest('tr');
    let transpType = select.val();
    let lgta = tr.attr('data-lgta');
    let lata = tr.attr('data-lata');
    let latb = tr.attr('data-latb');
    let lgtb = tr.attr('data-lgtb');
    let idtr = tr.attr('id');
    $.ajax({
        url: '/optimr/getKeys',
        type: 'GET',
        success: function(key){
            recallApi(key, transpType, lgta, lata, lgtb,latb, idtr);
        },
        error: function(err){
            console.log(err);
        }
    });

});

function recallApi(key, transpType, lgta, lata,lgtb,latb, idtr){
    var platform = new H.service.Platform({
        app_id: key.api_id,
        app_code: key.api_code,
        useHTTPS: true
    });
    var router = platform.getRoutingService(),
        routeRequestParams = {
            mode: 'fastest;'+transpType,
            representation: 'display',
            routeattributes: 'waypoints,summary,shape,legs',
            maneuverattributes: 'direction,action',
            waypoint0: lata + ',' + lgta,
            waypoint1: latb + ',' + lgtb,
            language: 'fr-fr'
        };
    router.calculateRoute(
        routeRequestParams,
        function (response) {
            let route = response.response.route[0];
            route.leg[0].maneuver.push({
                'departure_time': response.response.metaInfo.timestamp,
                transport_type: route.mode.transportModes[0]
            });
            $.ajax({
                url: '/optimr/maneuverToPath',
                data: JSON.stringify(route.leg[0].maneuver),
                type: 'POST',
                dataType: 'json',
                contentType: 'application/json',
                success: function (response) {
                    let summedScore = 0;
                    for (var i = 0; i < response.length; i++) {
                        if(response.length > 1) {
                            $('#'+idtr).remove();
                            var tr = '<tr data-score="' + response[i].score + '" data-lata="' + response[i].latitude + '" class="tr" id="trnb"' + i + ' data-lgta="' + response[i].longitude + '"' +
                                ' data-latb="' + response[i].latb + '" data-lgtb="' + response[i].lgtb + '">' +
                                '<td>' + $('#departure').val() + '</td>' +
                                '<td>' + $('#finish').val() + '</td>' +
                                '<td>' + response[i].duration + '</td>' +
                                '<td>' + response[i].distance + '</td>' +
                                '<td>' + response[i].co2Rate + '</td>' +
                                '<td>' + response[i].price + '</td>' +
                                '<td><div id="transport" class="input-field">\n';
                            switch (response[i].transport_type) {
                                case 'voiture':
                                    tr +=
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car" selected data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>';
                                    break;
                                case 'tram':
                                    tr +=
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option selected value="publicTransport" >Tram</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>';
                                    break;
                                case 'bus':
                                    tr +=
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option selected value="publicTransport" >Bus</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>';
                                    break;
                                case 'velo':
                                    tr +=
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" selected data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>';
                                    break;
                                default:
                                    tr +=
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" selected data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>';
                                    break;
                            }
                            tr += '<td>' + response[i].score + '</td></tr>';
                            $('#mytable').append(tr);
                        }
                        else{
                            var tr = $('#'+idtr);
                            tr.attr('data-score',response[i].score)
                                .attr('data-lata', response[i].latitude )
                                .attr('id', 'trnb'+i)
                                .attr('data-lgta', response[i].longitude)
                                .attr('data-latb', response[i].latb)
                                .attr('data-lgtb', response[i].lgtb);
                            tr.html('<td>' + $('#departure').val() + '</td>' +
                                '<td>' + $('#finish').val() + '</td>' +
                                '<td>' + response[i].duration + '</td>' +
                                '<td>' + response[i].distance + '</td>' +
                                '<td>' + response[i].co2Rate + '</td>' +
                                '<td>' + response[i].price + '</td>');
                            switch (response[i].transport_type) {
                                case 'voiture':
                                    tr.append(
                                        '<td><div id="transport" class="input-field">\n' +
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car" selected data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>');
                                    break;
                                case 'tram':
                                    tr.append(
                                        '<td><div id="transport" class="input-field">\n' +
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option selected value="publicTransport" >Tram</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>');
                                    break;
                                case 'bus':
                                    tr.append(
                                        '<td><div id="transport" class="input-field">\n' +
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option selected value="publicTransport" >Bus</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>');
                                    break;
                                case 'velo':
                                    tr.append(
                                        '<td><div id="transport" class="input-field">\n' +
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" selected data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>');
                                    break;
                                default:
                                    tr.append(
                                        '<td><div id="transport" class="input-field">\n' +
                                        '        <select class="icons green-text transportChoices">\n' +
                                        '            <option value="car"  data-icon="../img/voiture.png">Voiture</option>\n' +
                                        '            <option value="bicycle" data-icon="../img/velo.png">Vélo</option>\n' +
                                        '            <option value="pedestrian" selected data-icon="../img/pieds.png">Piéton</option>\n' +
                                        '            <option value="publicTransport" >Transport Public</option>\n' +
                                        '        </select>\n' +
                                        '    </div></td>');
                                    break;
                            }
                            tr.append('<td>' + response[i].score + '</td>');
                            $('#mytable').append(tr);
                        }
                        $('select').formSelect();
                    }
                    $('select').formSelect();
                    let trClass = $('select').closest('tr');
                    trClass.attr('data-score');
                    for(var i = 0; i < trClass.length; i++){
                        summedScore+= parseInt(trClass[i].getAttribute('data-score'));
                    }
                    let panel = $('#panel');
                    $('#totalScore').remove();
                    panel.append('<h4 id="totalScore">Score Total : ' + summedScore + '</h4>');

                },
                error: function (err) {
                    console.log(err);
                }
            });

        },
        function(err){})
}




