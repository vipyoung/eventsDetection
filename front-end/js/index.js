var EventZoom = 'none';
var zoomVal = 11;
var sliderControl = null
var person_position;
var radius;

var Events = [];
var dictionary;
var test = 0;
var category_array = [];
var dictionary2 = {};

//arrays of markers
var blueArr = [];
var redArr = [];
var orangeArr = [];
var greenArr = [];
var violetArr = [];
var greyArr = [];
var manualArr = [];

//marker colors
var blueIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-blue.png',
    //shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#2681C8'
});

var redIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#C82739'
});

var greenIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-green.png',
    // shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#27AB27'
});

var orangeIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-orange.png',
    //shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CC8325'
});

var yellowIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-yellow.png',
    //shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CAC428'
});

var violetIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-violet.png',
    // shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#9A26C9'
});

var greyIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-grey.png',
    //shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#777777'
});

var blackIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-black.png',
    //shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#3C3C3C'
});

var personIcon = new L.Icon({
    iconUrl: 'img/person2.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#3C3C3C'
});

var iconArr = [blueIcon, redIcon, greenIcon, orangeIcon, violetIcon, greyIcon, yellowIcon, blackIcon]; //
//corresponding color values
//var ColDict=['#2681C8','#C82739','#27AB27','#CC8325','#CAC428','#9A26C9','#777777','#3C3C3C']
var ColDict = ["primary", "danger", "success", "warning", "info", "default"]; //length=7
var color_array = ['blue', 'red', 'green', 'orange', 'violet', 'grey', 'yellow', 'black'];

//create map layer for each category
var blueLayer = new L.LayerGroup();
var redLayer = new L.LayerGroup();
var greenLayer = new L.LayerGroup();
var orangeLayer = new L.LayerGroup();
var violetLayer = new L.LayerGroup();
var greyLayer = new L.LayerGroup();
var yellowLayer = new L.LayerGroup();
var blackLayer = new L.LayerGroup();
var manualLayer = new L.LayerGroup();
var personLayer = new L.LayerGroup();

// initializing the map 
var map = L.map('mapid', {
    center: [25.296637, 51.517686],
    zoom: 12,
    layers: [blueLayer, redLayer, greenLayer, orangeLayer, violetLayer, greyLayer, manualLayer, personLayer]
});
L.tileLayer('https://api.mapbox.com/styles/v1/n-alathba/cj2fzxjgl00bl2rqno6mtb9wg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibi1hbGF0aGJhIiwiYSI6ImNqMmZ6bTQ2cDAwNDIyeW8wY2hidjFxdjUifQ.TyQ2WNEMtCO3Q84PYXlAEA', {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 18,
    minZoom: 1,
}).addTo(map);

function onEachFeature(feature, layer) {
    dictionary2[feature.properties.title] = {}
    dictionary2[feature.properties.title]['category'] = feature.properties.category;
    dictionary2[feature.properties.title]['link'] = feature.properties.link;
    dictionary2[feature.properties.title]['information'] = feature.properties.information;
    dictionary2[feature.properties.title]['date'] = feature.properties.date;
    dictionary2[feature.properties.title]['location'] = feature.geometry.coordinates;
    dictionary2[feature.properties.title]['image'] = feature.properties.image;
    dictionary2[feature.properties.title]['event_venue'] = feature.properties.event_venue;
    dictionary2[feature.properties.title]['name'] = feature.properties.title;
}





var link = './application/events.json'
//$.getJSON(link, function(events) {
$.getJSON(link)
    .done(function(events) {
    L.geoJSON(events, {
        style: function(feature) {
            return feature.properties && feature.properties.style;
        },
        onEachFeature: onEachFeature,
        pointToLayer: function(feature, latlng) {
            return L.marker(latlng);
        }
    });
    //
    processData(dictionary2);
    //
    renderSwitches();
    //
    listOfEvents();
    //
    manageLayers(dictionary2);
    //choose an event from the list
    $(".eventItem").click(function(event) {
        console.log("events", Events);
        var newID = event.target.id;
        for (var key in dictionary2) {
            var dictValues = dictionary2[key];

            if (this.id == dictValues.name) {
                var output8 = '<div class="sidebar-header header-cover box" style="padding-left:1%;color:white;background-image:linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(' + dictValues.image + ');height:30vh;"><div class="resize" ><p style="font-size:19px;font-weight:950;font-family: "Arial Black", Times, serif;"><strong style="font-size:25px;">' + adjust_string(dictValues.name, 65) + '</strong><br>' + adjust_string(dictValues.information, 65) + '</p></div></div>'
                $(".box").replaceWith(output8);
            }
        }
        $('.box').each(function() {
            var inner = $(this).find('p');
            $(this).height(inner.outerHeight(true));
            $(this).width(inner.outerWidth(true));
        });

        for (var i = 0; i < Events.length; i++) {
            if (this.id == Events[i]) {
                zoom_to_pin(dictionary2, category_array, Events[i]);
            }
        }
    });

    //check/uncheck a category
    $(".filter").click(function(event) {
        var newID = event.target.id;
        clear_layers();
        plot_loop(dictionary2);
        manageLayers(dictionary2);
        clearManualLayer();
    });

    $(".spinnerCLick").click(function(event) {
        clear_layers();
        plot_loop(dictionary2);
        manageLayers(dictionary2);
        clearManualLayer();
    });

    $('#datetimepicker4').on('dp.change', function(e) {
        clear_layers();
        plot_loop(dictionary2);
        manageLayers(dictionary2);
        clearManualLayer();
    });

    $('#datetimepicker5').on('dp.change', function(e) {
        clear_layers();
        plot_loop(dictionary2);
        manageLayers(dictionary2);
        clearManualLayer();
    });

    //list search function
    jQuery(document).ready(function($) {
        $('.live-search-list li').each(function() {
            $(this).attr('data-search-term', $(this).text().toLowerCase());
        });
        $('.live-search-box').on('keyup', function() {
            var searchTerm = $(this).val().toLowerCase();
            $('.live-search-list li').each(function() {
                if ($(this).filter('[data-search-term *= ' + searchTerm + ']').length > 0 || searchTerm.length < 1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    });

    //3rd main checkbox
    $("#checkboxCategories").click(function(event) {
        plot_loop(dictionary2);
        manageLayers(dictionary2);
        $(".filter").attr('checked', true);
        if ($("#checkboxCategories").is(':checked')) {
            $("#EventsFilter").show();
        } else {
            $("#EventsFilter").hide();
            add_layers();
            show_whole_list();
        }
    });

    $("#checkboxCustom").click(function(event) {
        if ($("#checkboxCustom").is(':checked')) {
            $("#spinnerContainer").show();
            var newID = event.target.id;
            map.setView([25.296637, 51.517686], 12, {
                animation: true,
                center: [25.296637, 51.517686]
            });
            clear_layers();
            addCustomMarker(dictionary2);
            person_position = [25.296637, 51.517686];
        } else {
            personLayer.clearLayers();
            $("#spinnerContainer").hide();
        }
        plot_loop(dictionary2);
        manageLayers(dictionary2);
    });

    $("#defaultView").click(function(event) {
       // var output9 = '<div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo1.png);height:15vh;"><div class="resize" ></div></div>';
      // var output9 = '<div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo12.bmp);height:19vh;">';
      //var output9 =  ' <div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo18.bmp);height:19vh;">';
      var output9 = '<div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo19.bmp);height:19vh;">';
        $(".box").replaceWith(output9);
        var newID = event.target.id;
        map.setView([25.296637, 51.517686], 12, {
            animation: true,
            center: [25.296637, 51.517686]
        });
        // renderSwitches();
        manageLayers(dictionary2)
    });

    $("#checkboxDateFilter").click(function(event) {
        if ($("#checkboxDateFilter").is(':checked')) {
            $("#datetimepickers").show();
        } else {
            $("#datetimepickers").hide();
        }
        clear_layers();
        plot_loop(dictionary2);
        manageLayers(dictionary2);
    });
    plot_loop(dictionary2);
})
 .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
});






function adjust_string(string, char_limit) {
    var output7 = '';
    var string2 = string.split(" ");
    var lengthCount = 0;
    //to keep track of empty spaces
    var wordCount = 0;
    for (var i in string2) {
        if ((lengthCount + string2[i].length) > (char_limit - wordCount)) {
            output7 += '<br>' + ' ' + string2[i];
            lengthCount = string2[i].length;
            wordCount = 0;
        } else {
            output7 += " " + string2[i];
            lengthCount += string2[i].length;
            wordCount++;
        }
    }
    return output7;
}

console.log("width", $('#backgroundImages').width());
console.log("height", $('#backgroundImages').height());

function plot_loop(dictionary) {
    for (var key in dictionary) {
        var dictValues = dictionary[key];

        plot_marker(dictValues);
    }
}

//calculates didstance between person icon and the given marker
function get_distance(marker, coordinate) {
    return marker.getLatLng().distanceTo(coordinate);

}
//
function processData(dictionary) {
    var carouselOutput2 = '';
    var carouselCount = 0;
    var carouselCounterOutput2 = ''
    //create array of events
    for (var key in dictionary) {
        var dictValues = dictionary[key];
        //populates Events[]
        Events.push(key);
        if (!category_array.includes(dictValues.category)) {
            category_array.push(dictValues.category);
        }
    }
}

function clear_layers() {
    manualLayer.clearLayers();
    for (var i = 0; i < color_array.length; i++) {
        eval(color_array[i] + "Layer").clearLayers();
    }
}

function add_layers() {
    for (var i = 0; i < color_array.length; i++) {
        // //console.log("color",color)
        map.addLayer(eval(color_array[i] + "Layer"));
    }
}

function addCustomMarker(dictionary) {
    var personMarker = L.marker([25.296637, 51.517686], {
        icon: personIcon,
        draggable: 'true'
    }).addTo(personLayer);
    personMarker.on('dragend', function(event) {
        clear_layers();
        var marker = event.target;
        person_position = marker.getLatLng();
        plot_loop(dictionary);
    });
}

//Convert time from 24H to 12H form (00:00:00) to (00:00 AM/PM)
function to_12H(time24) {
    var offTime = time24.split(':');
    var hour = offTime[0];
    offTime = offTime.slice(0, 2);
    //console.log(offTime);
    offTime[0] = offTime[0] % 12;
    var time12 = offTime.join(':');
    if (hour >= 12) {
        time12 = time12 + " PM";
    } else {
        time12 = time12 + " AM";
    }
    return time12;
}

//returns 1 if t1>t22 , 0 if t1==t2, 2 if t2>t1
function compare_time(t1, t2) {
    t1 = t1.replace(" ", ":");
    t2 = t2.replace(" ", ":");
    var offTime = t1.split(':');
    var offTime2 = t2.split(':');
    console.log("offTime", offTime, offTime2);
    //compare AM/PM
    if (offTime[2] == "AM" && offTime2[2] == "PM") {
        return 2;
    }
    if (offTime2[2] == "AM" && offTime[2] == "PM") {
        return 1;
    }
    //compare hours
    if (offTime[0] > offTime2[0]) {
        return 1;
    }
    if (offTime2[0] > offTime[0]) {
        return 2;
    }
    //compare minutes
    if (offTime[1] > offTime2[1]) {
        return 1;
    }
    if (offTime2[1] > offTime[1]) {
        return 2;
    }
    return 0;
}

//when 2nd & 3rd parameters are null checks with today's date
function is_valid_date(eventTiming, userStartTiming, userEndTiming) //ex: "2017-06-07 00:00:00 2017-05-21 00:00:00",06/14/2017 12:00 AM,06/28/2017 12:00 AM
{
    console.log('userStartTiming', userStartTiming, 'userEndTiming', userEndTiming);
    if (userStartTiming != '' && userEndTiming == '') {
        userEndTiming = "02/26/4498 12:10 AM";
    }
    if (userStartTiming == '' && userEndTiming != '') {
        userStartTiming = "03/01/0000 12:10 AM"
    }
    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var currentTime = new Date().toJSON().slice(11, 16);
    currentTime = to_12H(currentTime);
    eventTiming = $.trim(eventTiming);
    var eventSplit = eventTiming.split(" ");
    var eventStartDate = eventSplit[2];
    var eventEndDate = eventSplit[0];
    //Convert event time from 24H to 12H   
    var eventEndTime = to_12H(eventSplit[1]);
    console.log("12");
    console.log(eventSplit);
    var eventStartTime = to_12H(eventSplit[3]);
    console.log("eventStartDate", eventStartDate);
    console.log("eventEndTime", eventEndTime);
    console.log("eventEndDate", eventEndDate);
    console.log("eventStartTime", eventStartTime);
    if (moment(eventEndDate, 'YYYY-MM-DD') < moment(eventStartDate, 'YYYY-MM-DD')) {
        return false;
    }
    if (moment(eventEndDate, 'YYYY-MM-DD') >= moment(eventStartDate, 'YYYY-MM-DD') && moment(eventEndDate, 'YYYY-MM-DD') <= moment(eventStartDate, 'YYYY-MM-DD') &&
        (compare_time(eventStartTime, eventEndTime) == 1)) {
        return false;
    }
    if ((userStartTiming == null || userStartTiming == "") && (userEndTiming == null || userEndTiming == "")) {
        if (moment(today, 'YYYY/MM/DD') > moment(eventEndDate, 'YYYY-MM-DD')) {
            return false;
        }
        if (moment(today, 'YYYY/MM/DD') >= moment(eventEndDate, 'YYYY-MM-DD') && moment(today, 'YYYY/MM/DD') <= moment(eventEndDate, 'YYYY-MM-DD') && compare_time(eventEndTime, currentTime) == 1) {
            return false;
        }
        return true;
    }
    var userStartTimingSplit = userStartTiming.split(" ");
    console.log("userStartTimingSplit", userStartTimingSplit);
    var userStartDate = userStartTimingSplit[0];
   // console.log("11");

    var userStartTime = userStartTimingSplit[1] + " " + userStartTimingSplit[2];
   // console.log("12");
    var userEndTimingSplit = userEndTiming.split(" ");
   // console.log("13");
    var userEndDate = userEndTimingSplit[0];
    //console.log("14");
    var userEndTime = userEndTimingSplit[1] + " " + userEndTimingSplit[2];
    console.log("eventStartTime", eventStartTime);
    console.log("eventEndTime", eventEndTime);
    console.log("eventEndDate", eventEndDate);
    console.log("eventStartDate", eventStartDate);
    console.log("eventStartTime", eventStartTime);
    console.log("eventEndTime", eventEndTime);
    console.log("userStartDate", userStartDate);
    console.log("userEndDate", userEndDate);

    if ((moment(userEndDate, 'MM/DD/YYYY') < moment(userStartDate, 'MM/DD/YYYY'))) {
        alert("Not a valid time span");
    }
    if (moment(userEndDate, 'MM/DD/YYYY') >= moment(userStartDate, 'MM/DD/YYYY') && moment(userEndDate, 'MM/DD/YYYY') <= moment(userStartDate, 'MM/DD/YYYY') &&
        compare_time(userStartTime, userEndTime) == 1) {
        alert("Not a valid time span");
    }
    if (moment(userEndDate, 'MM/DD/YYYY') >= moment(userStartDate, 'MM/DD/YYYY') && moment(userEndDate, 'MM/DD/YYYY') <= moment(userStartDate, 'MM/DD/YYYY') &&
        compare_time(userStartTime, userEndTime) == 1) {
        alert("Not a valid time span");
    }

    if (moment(userStartDate, 'MM/DD/YYYY') >= moment(eventStartDate, 'YYYY-MM-DD') && moment(userStartDate, 'MM/DD/YYYY') <= moment(eventStartDate, 'YYYY-MM-DD') &&
        (compare_time(userStartTime, eventStartTime) == 1)) {
        return false;
    }
    console.log("3", moment(userEndDate, 'MM/DD/YYYY') == moment(userStartDate, 'MM/DD/YYYY'));
    if (moment(userEndDate, 'MM/DD/YYYY') >= moment(eventEndDate, 'YYYY-MM-DD') && moment(userEndDate, 'MM/DD/YYYY') <= moment(eventEndDate, 'YYYY-MM-DD') &&
        (compare_time(userEndTime, eventEndTime) == 2)) {
        return false;
    }
    // console.log(moment(userEndDate, 'MM/DD/YYYY')<= moment(eventEndDate, 'YYYY-MM-DD'));

    console.log('userEndDate', userEndDate)
    console.log(moment(eventStartDate, 'YYYY-MM-DD') <= moment(userEndDate, 'MM/DD/YYYY'))
    return moment(userStartDate, 'MM/DD/YYYY') <= moment(eventEndDate, 'YYYY-MM-DD') &&
        moment(eventStartDate, 'YYYY-MM-DD') <= moment(userEndDate, 'MM/DD/YYYY') &&
        moment(userEndDate, 'MM/DD/YYYY') >= moment(eventEndDate, 'YYYY-MM-DD') &&
        moment(eventStartDate, 'YYYY-MM-DD') >= moment(userStartDate, 'MM/DD/YYYY');
}
//converts date from YYYY-MM-DD to MM/DD/YYYY
function convert_date_format(date) {
    var string = date.split('-');
    var date2 = string[1] + '/' + string[2] + '/' + string[0];
    return date2;
}

function plot_marker(eventDict) {
    var string = '';
    var eventDate = $.trim(eventDict.date);
    eventDate = eventDate.split(" ");
    var eventEndDate = eventDate[0];
    var eventEndTime = eventDate[1];
    var eventStartDate = eventDate[2];
    var eventStartTime = eventDate[3];
    if (eventStartTime == "00:00:00") {
        eventStartTime = null;
    }
    if (eventEndTime == "00:00:00") {
        eventEndTime = null;
    }
    if (eventDict.image != null) {
        string += '<div><img src="' + eventDict.image + '" style="width:100%;"></br></div><br>';
    }
    string += '<a class="popup_txt" href="';
    if (eventDict.link != null) {
        string += eventDict.link;
    } else {
        string += '#';
    }
    string += '"target="_blank">';
    if (eventDict.name != null) {
        string += eventDict.name;
    }
    string += '</a>';
    if (eventDict.event_venue != null) {
        string += '<div class="popup_txt"> <strong>Hosted by:</strong> ' + eventDict.event_venue + '</div>';
    }
    if (eventStartDate != null) {
        string += '<div class="popup_txt"> <strong>Date:</strong> ' + convert_date_format(eventStartDate) + " - " + convert_date_format(eventEndDate) + '</div>';
    }
    if (eventStartTime != null) {
        string += '<div class="popup_txt"><strong> Starts at:</strong> ' + to_12H(eventStartTime) + '</div>';
    }
    if (eventEndTime != null) {
        string += '<div class="popup_txt"><strong>Ends at:</strong> ' + to_12H(eventEndTime) + '</div></br>';
    }
    //
    var eventIndx = category_array.indexOf(eventDict.category);
    var event_icon = iconArr[eventIndx];
    var mapArr = eval(color_array[eventIndx] + 'Arr');
    var mapLayer = eval(color_array[eventIndx] + 'Layer');
    var marker = L.marker(eventDict.location, {
        icon: event_icon
    }).bindPopup(string, {
        minWidth: 600
    });

    if ($("#checkboxDateFilter").is(':checked')) {
        if (is_valid_date(eventDict.date, document.getElementById("datetimepicker4").value, document.getElementById("datetimepicker5").value)) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
        } else {
            return;
        }
    }
    if ($("#checkboxCustom").is(':checked')) {
        mapLayer.removeLayer(marker);
        if (get_distance(marker, person_position) < (document.getElementById("radiusSpinner").value) * 1000) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
        } else {
            return;
        }
    } else {
        marker.addTo(mapLayer);
        mapArr.push(marker);
    }
}
//
function manageLayers(dictionary) {

    if (!($("#checkboxCategories").is(':checked'))) {
        add_layers();
        return;
    }

    for (var i = 0; i < color_array.length; i++) {
        if ($('#checkbox-' + color_array[i]).is(':checked')) {
            map.addLayer(eval(color_array[i] + "Layer"));
        } else {
            map.removeLayer(eval(color_array[i] + "Layer"));
        }
    }

    ul = document.getElementById("list_of_events");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        var dictValues = dictionary[li[i].id];
        console.log("dcitjl",li[i].id);
        if(li[i].id == "none"){break;}
        var eventIndx = category_array.indexOf(dictValues.category);
        var category_color = color_array[eventIndx];

        if (!$("#checkbox-blue").is(':checked') && category_color == "blue") {
            li[i].style.display = "none";
        } else {
            li[i].style.display = "";
        }

        if (!$("#checkbox-grey").is(':checked') && category_color == "grey") {
            li[i].style.display = "none";
        } else if (category_color == "grey") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-green").is(':checked') && category_color == "green") {
            li[i].style.display = "none";
        } else if (category_color == "green") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-red").is(':checked') && category_color == "red") {
            li[i].style.display = "none";
        } else if (category_color == "red") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-orange").is(':checked') && category_color == "orange") {
            li[i].style.display = "none";
        } else if (category_color == "orange") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-violet").is(':checked') && category_color == "violet") {
            li[i].style.display = "none";
        } else if (category_color == "violet") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-yellow").is(':checked') && category_color == "yellow") {
            li[i].style.display = "none";
        } else if (category_color == "yellow") {
            li[i].style.display = "";
        }

        if (!$("#checkbox-black").is(':checked') && category_color == "black") {
            li[i].style.display = "none";
        } else if (category_color == "black") {
            li[i].style.display = "";
        }
    }
}

function show_whole_list() {
    ul = document.getElementById("list_of_events");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        li[i].style.display = ""
    }
}

function clearManualLayer() {
    for (var i = 0; i < manualArr.length; i++) {
        manualLayer.removeLayer(manualArr[i]);
    }
}

//adds checkbox
function renderSwitches() {
    var output4;
    output4 = '';
    for (var i = 0; i < category_array.length; i++) {
        output4 += '<li><div class="checkbox checkbox-primary filter" ><div class="checkbox-' + color_array[i] + '"><input id="checkbox-' + color_array[i] + '" name=""checkbox-' + color_array[i] + '" type="checkbox" checked="" ><label for="checkbox-' + color_array[i] + '" >' + category_array[i] + '</label></div></div></li>';
        document.getElementById("EventsFilter").innerHTML = output4;
    }
}
//
function zoom_to_pin(dictionary, category_array, Event) {
    //add the event's pin with a popup
    clearManualLayer();
    var dictValues = dictionary[Event];

    var string = '';
    var eventDate = $.trim(dictValues.date);
    eventDate = eventDate.split(" ");
    var eventEndDate = eventDate[0];
    var eventEndTime = eventDate[1];
    var eventStartDate = eventDate[2];
    var eventStartTime = eventDate[3];
    if (eventStartTime == "00:00:00") {
        eventStartTime = null;
    }
    if (eventEndTime == "00:00:00") {
        eventEndTime = null;
    }

    if (dictValues.image != null) {
        string += '<div><img src="' + dictValues.image + '" style="width:100%;"></br></div><br>';
    }
    string += '<a class="popup_txt" href="';
    if (dictValues.link != null) {
        string += dictValues.link;
    } else {
        string += '#';
    }
    string += '"target="_blank">';
    if (dictValues.name != null) {
        string += dictValues.name;
    }
    string += '</a>';
    if (dictValues.event_venue != null) {
        string += '<div class="popup_txt"> <strong>Hosted by:</strong> ' + dictValues.event_venue + '</div>';
    }
    if (eventStartDate != null) {
        string += '<div class="popup_txt"> <strong>Date:</strong> ' + convert_date_format(eventStartDate) + " - " + convert_date_format(eventEndDate) + '</div>';
    }
    if (eventStartTime != null) {
        string += '<div class="popup_txt"><strong> Starts at:</strong> ' + to_12H(eventStartTime) + '</div>';
    }
    if (eventEndTime != null) {
        string += '<div class="popup_txt"><strong>Ends at:</strong> ' + to_12H(eventEndTime) + '</div></br>';
    }

    map.panTo(dictValues.location, {
        center: dictValues.location
    });
    map.setView(dictValues.location, 16, {
        animation: true,
        center: dictValues.location
    });
    var EventIndx = category_array.indexOf(dictValues.category);

    var marker = L.marker(dictValues.location, {
        icon: iconArr[EventIndx]
    }).bindPopup(string)
    marker.addTo(manualLayer).openPopup();
    manualArr.push(marker);
}

function listOfEvents() {
    var eventsListOutput;
    eventsListOutput = '';
    for (var i = 0; i < Events.length; i++) {
        eventsListOutput += '<li class="eventItem" id="' + Events[i] + '"><a href="#"  style="font-size:10; color: white; color: black;-webkit-text-fill-color: white;-webkit-text-stroke-width: 0.05px;-webkit-text-stroke-color: black;">'+ adjust_string(Events[i],49) + '</a></li> <li id="none" class="divider"></li>';
    }
    document.getElementById("list_of_events").innerHTML = eventsListOutput;
}