var map = L.map('map').setView([25.296637, 51.517686], 9);
        mapLink = 
            '<a href="http://openstreetmap.org">OpenStreetMap</a>';
        L.tileLayer(
            'http://korona.geog.uni-heidelberg.de/tiles/roadsg/x={x}&y={y}&z={z}', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 15,
            minZoom: 9
            }).addTo(map);


function addDataToMap(data, map) {
    var dataLayer = new L.geoJson(data, {style : style, onEachFeature : onEachFeature});
    dataLayer.addTo(map);
    }
    $.getJSON("qat_adm1.geojson", function(data) { addDataToMap(data, map); })


    function getColor(name) {
    return name == "Ad Dawhah" ? '#f6e8c3' :
           name == "Al Daayen" ? '#d8b365' :
           name == "Ar Rayyan" ? '#c7eae5' :
           name == "Al Khor"  ? '#f5f5f5' :
           name == "Al Wakrah" ? '#8c510a' :
           name == "Umm Salal" ? '#5ab4ac' :
           name == "Madinat ash Shamal" ? '#01665e' :
                      '#6a6666';
    }


    function style(feature) {
    return {
        fillColor: getColor(feature.properties.NAME_1),
        opacity: 0.85,
        weight: 2,
        color: getColor(feature.properties.NAME_1),
        fillOpacity: 0.7
    };
    }


    function selectFeature(e) {
    var layer = e.target;
    layer.setStyle({
        color: '#000000',
        weight: 2
        });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
        }
        info.update(layer.feature.properties);
    }


    function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    }


    function onEachFeature(feature, layer) {

    layer.on({
        mouseover: selectFeature,
        //click: zoomToFeature
        });

    var label = L.marker(layer.getBounds().getCenter(), {
      icon: L.divIcon({
        className: 'label',
        html: feature.properties.NAME_1 + ' (' + feature.properties.NL_NAME_1 + ')',
        iconSize: [40, 70]
      })
     }).addTo(map);

    layer.on('click', function(e) {
        if(feature.properties.NAME_1 == "Umm Salal")
        {
            $("#household").load("result_household.json", function(data,status){

                    var array_1 = data.split(",");
                    var array_2 = array_1[0].toString().split("{");
                    var array_3 = array_2[2].toString().split("}");
                    var array_4 = array_3.toString().split(":");
                    var array_5 = array_4[1].toString().split(",")

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array_5[0] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Ar Rayyan")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 1;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Al Daayen")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 2;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Al Wakrah")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 3;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Al Khor")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 5;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Madinat ash Shamal")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 6;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';

            });
        }
        else if(feature.properties.NAME_1 == "Ad Dawhah")
        {
            $("#household").load("result_household.json", function(data,status){

                    var i = 7;
                    var array = get_result(data,i);

                    this.innerHTML = feature.properties.NAME_1 +  '<br><br>' + "Total number of households: " + array[1] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' +
                     '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp';
            });
        }            
        function get_result(dataString,i)
        {
                    var array_1 = dataString.split(",");                       
                    var array_2 = array_1[i].toString().split("{");
                    var array_3 = array_2[1].toString().split("}");
                    var array_4 = array_3[0].toString().split(":");
                    return array_4;
        }
    });                 
    layer.on('mouseout', function(e) {                 //on mouseout, goes back to default style
            layer.setStyle({
                color: getColor(feature.properties.NAME_1),
                fillColor: getColor(feature.properties.NAME_1)
            });
        });
    //layer.bindLabel(getData(feature.properties.NAME_1))
    //layer.addTo(map);
    }