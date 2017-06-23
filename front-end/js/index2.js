var EventZoom = 'none';
var zoomVal = 11;
var sliderControl = null
var person_position;
var radius;

var Events = [];
//var dictionary;
var test = 0;
var category_array = [];
var dictionary2 = {};
var markers_dictionary = {};

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
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#2681C8'
});

var redIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#C82739'
});

var greenIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-green.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#27AB27'
});

var orangeIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-orange.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CC8325'
});

var yellowIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-yellow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CAC428'
});

var violetIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-violet.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#9A26C9'
});

var greyIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-grey.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#777777'
});

var blackIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-black.png',
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

function create_local_dict(dictionaryValue) {
    dictionary2[dictionaryValue.title] = {}
    dictionary2[dictionaryValue.title]['category'] = dictionaryValue.category;
    dictionary2[dictionaryValue.title]['link'] = dictionaryValue.link;
    dictionary2[dictionaryValue.title]['information'] = dictionaryValue.information;
    dictionary2[dictionaryValue.title]['date'] = dictionaryValue.date;
    dictionary2[dictionaryValue.title]['image'] = dictionaryValue.image;
    dictionary2[dictionaryValue.title]['name'] = dictionaryValue.title;
    dictionary2[dictionaryValue.title]['location'] = [];
    dictionary2[dictionaryValue.title]['event_venue'] = [];
    for (var i in dictionaryValue.location) {
        var locationName = dictionaryValue.location[i].location_name;
        dictionary2[dictionaryValue.title].event_venue.push(locationName);
        dictionary2[dictionaryValue.title].location.push([dictionaryValue.location[i].latitude, dictionaryValue.location[i].longitude]);
    }
}



// get JSON file (to be change to get the data from web-services or mongoDB)
var link = "./application/events4.json";
//console.log(link_to_data);

$.getJSON(link)
    .done(function(dictionary) {
        for (var i = 0; i < dictionary.length; i++) {
            create_local_dict(dictionary[i]);
        }
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
            var newID = event.target.id;
            var numVenues = dictionary2[this.id].location.length;
            var markerDictValue = markers_dictionary[this.id];
            console.log("sss", markerDictValue);
            clear_layers();


            var dictValues = dictionary2[this.id];
            dictValues2 = dictionary_item(dictionary2, this.id)
            var eventsSeenArr = []; //used to manage the list of events
            //create a duplicate to prevent modifying original dictionary
            for (var i = 0; i < dictValues.location.length; i++) {
                dictValues2['location'] = dictValues.location[i];
                dictValues2['event_venue'] = dictValues.event_venue[i];
                dictValues2["title"] = (dictValues.name + String(i));
                if (dictValues2.location != null && dictValues2.location[0] != null &&
                    dictValues2.location[1] != null && dictValues2.location.length == 2) {
                    plot_marker(dictValues2, eventsSeenArr);
                }

            }
            for (var key in dictionary2) {
                var dictValues = dictionary2[key];

                if (this.id == dictValues.name) {
                    var output8 = '<div class="sidebar-header header-cover box" style="padding-left:1%;color:white;background-image:linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(' + dictValues.image + ');height:30vh;"><div class="resize" ><p style="font-size:19px;font-weight:950;font-family: "Arial Black", Times, serif;"><strong style="font-size:25px;">' + adjust_string(dictValues.name, 65) + '</strong><br>' + adjust_string(dictValues.information, 60) + '</p></div></div>'
                    $(".box").replaceWith(output8);
                }
            }
            $('.box').each(function() {
                var inner = $(this).find('p');
                $(this).height(inner.outerHeight(true));
                $(this).width(inner.outerWidth(true));
            });
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


        $("body").on("click", ".zoomBtn", function() {
            var location = this.id;
            location = location.split(",");
            var locationArr = [];
            locationArr.push(eval(location[0]));
            locationArr.push(eval(location[1]));
            map.setView(locationArr, 16, {
                animation: true,
                center: locationArr
            });
        })


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
            var output9 = '<div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo19.bmp);height:19vh;">';
            $(".box").replaceWith(output9);
            var newID = event.target.id;
            map.setView([25.296637, 51.517686], 12, {
                animation: true,
                center: [25.296637, 51.517686]
            });
            clear_layers();
            plot_loop(dictionary2);
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


function dictionary_item(dictionary, key) {
    var dictValues = dictionary[key];
    var dictValues2 = {};
    dictValues2['category'] = dictValues.category;
    dictValues2['link'] = dictValues.link;
    dictValues2['information'] = dictValues.information;
    dictValues2['date'] = dictValues.date;
    dictValues2['image'] = dictValues.image;
    dictValues2['name'] = dictValues.name;

    return dictValues2;

}




//for plotting all markers on the map as a helper function for most function
function plot_loop(dictionary) {
    var dictionary3 = dictionary;
    var eventsSeenArr = []; //used to manage the list of events
    for (var key in dictionary) {
        var dictValues = dictionary[key];
        dictValues2 = dictionary_item(dictionary, key)
        //create a duplicate to prevent modifying original dictionary
        for (var i = 0; i < dictValues.location.length; i++) {
            dictValues2['location'] = dictValues.location[i];
            dictValues2['event_venue'] = dictValues.event_venue[i];
            dictValues2["title"] = (dictValues.name + String(i));
            if (dictValues2.location != null && dictValues2.location[0] != null &&
                dictValues2.location[1] != null && dictValues2.location.length == 2) {
                plot_marker(dictValues2, eventsSeenArr);
            }

        }
        eventsSeenArr.push(dictValues.name);
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
    if (time24 == "00:00:00") {
        return "12:00 AM"
    }
    if (time24 == "12:00:00") {
        return "12:00 PM"
    }
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

//when 2nd parameter is empty checks with today's date
function is_valid_date(eventTiming, userStartTiming, userEndTiming)
{
     var today = new Date();
    if ( userEndTiming == '') {
    userEndTiming = "02/26/4498 12:01 AM";
    }
    if (userStartTiming == '' ) {
        userStartTiming = today;
    }
    var eventStartTiming = eventTiming[1];
    var eventEndTiming = eventTiming[0];
    var eventStartTiming = eventTiming[1];
    var eventEndTiming = eventTiming[0];

    var eventStartTimingSplit = eventStartTiming.split(" ");
    var eventEndTimingSplit = eventEndTiming.split(" ");

    var eventStartDate = convert_date_format(eventStartTimingSplit[0]);
    var eventEndDate = convert_date_format(eventEndTimingSplit[0]);
    //Convert event time from 24H to 12H   
    var eventEndTime = to_12H(eventEndTimingSplit[1]);
    var eventStartTime = to_12H(eventStartTimingSplit[1]);
    eventStartTiming = eventStartDate+" "+eventStartTime;
    eventEndTiming = eventEndDate+" "+eventEndTime;
    var eventStartTiming2= new Date(Date.parse($.trim(eventStartTiming))).getTime();
    var eventEndTiming2 = new Date(Date.parse($.trim(eventEndTiming))).getTime();
    var userStartTiming2 = new Date(Date.parse($.trim(userStartTiming))).getTime();
    var userEndTiming2 = new Date(Date.parse($.trim(userEndTiming))).getTime();
    if(userStartTiming2>userEndTiming2){alert("Not a valid time span");return;}
    if(eventStartTiming2>eventEndTiming2){return false;}
    return userStartTiming2<=eventEndTiming2 && eventStartTiming2<=userEndTiming2
    && userEndTiming2>=eventEndTiming2 && eventStartTiming2>=userStartTiming2;
}





//converts date from YYYY-MM-DD to MM/DD/YYYY
function convert_date_format(date) {
    var string = date.split('-');
    var date2 = string[1] + '/' + string[2] + '/' + string[0];
    return date2;
}
//
function plot_marker(eventDict, eventsSeenArr) {

    var string = '';
    var eventDate = eventDict.date;
    var eventEndTiming = eventDate[0];
    var eventEndTimingSplit = eventEndTiming.split(" ");
    var eventEndDate = eventEndTimingSplit[0];
    var eventEndTime = eventEndTimingSplit[1];

    var eventStartTiming = eventDate[1];
    var eventStartTimingSplit = eventStartTiming.split(" ");
    var eventStartDate = eventStartTimingSplit[0];
    var eventStartTime = eventStartTimingSplit[1];

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
    string += '<button  class="btn btn-green d-inline-block zoomBtn" id="' + eventDict.location + '" style="width: 27%;display: inline-block;height:4.5vh;margin-left:2vh;">Zoom to location</button>';
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
        title: eventDict.title,
        icon: event_icon
    }).bindPopup(string, {
        minWidth: 600
    });
    //
    var event_name = eventDict.name;
    if (!(event_name in markers_dictionary)) {
        markers_dictionary[event_name] = [];
        console.log("00");
    }
    var event_array = markers_dictionary[event_name];
    var count = 0;
    for (var i = 0; i < event_array.length; i++) {
        //check if similar marker is present and replace it
        if (event_array[i].options.title == marker.options.title) {
            event_array[i] = marker;
            count++;
        }
    }

    if (count == 0) {
        event_array.push(marker);
    }
    var currentArray = markers_dictionary[event_name];
    if (!(markers_dictionary[event_name].includes(marker))) {
        markers_dictionary[event_name].push(marker);
    }
    //
    if ($("#checkboxDateFilter").is(':checked')) {
        if (is_valid_date(eventDict.date, document.getElementById("datetimepicker4").value, document.getElementById("datetimepicker5").value)) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
            manage_list(true, eventDict, eventsSeenArr);
        } else {
            manage_list(false, eventDict,eventsSeenArr);
            return;
        }
    }
    if ($("#checkboxCustom").is(':checked')) {
        mapLayer.removeLayer(marker);
        if (get_distance(marker, person_position) < (document.getElementById("radiusSpinner").value) * 1000) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
            manage_list(true, eventDict, eventsSeenArr);
        } else {
            manage_list(false, eventDict, eventsSeenArr);
            return;
        }
    } else {
        manage_list(true, eventDict, eventsSeenArr);
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
}
//
function show_whole_list() {
    ul = document.getElementById("list_of_events");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        li[i].style.display = ""
    }
}
//
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
function listOfEvents() {
    var eventsListOutput;
    eventsListOutput = '';
    for (var i = 0; i < Events.length; i++) {
        eventsListOutput += '<li class="eventItem" id="' + Events[i] + '"><a href="#"  style="font-size:10; color: white; color: black;-webkit-text-fill-color: white;-webkit-text-stroke-width: 0.05px;-webkit-text-stroke-color: black;">' + adjust_string(Events[i], 49) + '</a></li> <li id="none" class="divider"></li>';
    }
    document.getElementById("list_of_events").innerHTML = eventsListOutput;
}
//
function manage_list(condition, dictValues, eventsSeenArr) // to display item condition==true, else condition ==flase
{
    var showDivider;
    $('.live-search-list li').each(function() {

        if (this.id != "none" && !eventsSeenArr.includes(this.id)) {

            if (this.id == dictValues.name && condition) {
                $(this).show();
                showDivider = true;
            } else {
                $(this).hide();
                showDivider = false;
            }
        } else if (!eventsSeenArr.includes(this.id)) {
            if (showDivider && this.id == "none") {
                $(this).show();
            }
            if (showDivider == false && this.id == "none") {
                $(this).hide();
            }
        }
    });
}