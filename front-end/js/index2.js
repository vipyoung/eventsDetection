var EventZoom = 'none';
var zoomVal = 11;
var sliderControl = null
var person_position;
var radius;


var Events = [];
var dictionary;
var test = 0;
var category_array = [];

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
//Reference :https://github.com/pointhi/leaflet-color-markers

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




// get JSON file (to be change to get the data from web-services or mongoDB)
var link_to_data = "./data/json_example2.json";
////console.log(link_to_data);

$.getJSON(link_to_data)
    .done(function(dictionary) {
        processData(dictionary);
        //
        renderSwitches();
        //
        listOfEvents();
        //
        manageLayers(dictionary);
        //
        //background_images(dictionary);
        //plot_valid_date(dictionary,null,null);
       

        //choose an event from the list
        $(".eventItem").click(function(event) {
            console.log("events", Events);
            var newID = event.target.id;
            for (var key in dictionary) {
                var dictValues = dictionary[key];
                
                if (this.id == dictValues.name){
                    var output8= '<div  class="sidebar-header header-cover box" style="padding-left:1%;color:white;background-image:linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url('+dictValues.image+');height:30vh;"><div class="resize" ><p style="font-size:19px;font-weight:950;font-family: "Arial Black", Times, serif;"><strong style="font-size:25px;">'+adjust_string(dictValues.name,65)+'</strong><br>'+adjust_string(dictValues.information,65)+'</p></div></div>'
                    $(".box").replaceWith(output8);
                    // document.getElementById("logo").innerHTML = output8;
                  }
                }
                 $('.box').each(function(){
                var inner = $(this).find('p');
                $(this).height(inner.outerHeight(true));
                $(this).width(inner.outerWidth(true)); 
            });

            for (var i = 0; i < Events.length; i++) {

                if (this.id == Events[i]) {
                    zoom_to_pin(dictionary, category_array, Events[i]);
                }
            }

        });

        //check/uncheck a category
        $(".filter").click(function(event) {
            ////console.log("clicked2nd?");
            var newID = event.target.id;
            clear_layers();
            ////console.log("switch")
            plot_loop(dictionary);
            manageLayers(dictionary);
            clearManualLayer();
        });


        $(".spinnerCLick").click(function(event) {
            ////console.log("clicked2nd?");
            clear_layers();
            console.log("switch")
            plot_loop(dictionary);
            manageLayers(dictionary);
            clearManualLayer();
        });

        $('#datetimepicker4').on('dp.change', function (e) {
            
            // plot_valid_date(dictionary, document.getElementById("datetimepicker4").value, document.getElementById("datetimepicker5").value);
            clear_layers();
            ////console.log("switch")
            plot_loop(dictionary);
            manageLayers(dictionary);
            clearManualLayer();
        });

        $('#datetimepicker5').on('dp.change', function (e) {
            
                     clear_layers();
            ////console.log("switch")
            plot_loop(dictionary);
            manageLayers(dictionary);
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
            plot_loop(dictionary);
            manageLayers(dictionary);
        //    for (var i = 0; i < color_array.length; i++) {
                //set all checkboxes to checked when unchecking the main one
                $(".filter").attr('checked', true);
                   // $('input[name=checkbox-blue]').attr('checked', true);
                   //  $('.filter').checked = true;
        ////console.log("Events filter")
                 
            if ($("#checkboxCategories").is(':checked')) {
                $("#EventsFilter").show();
            } else {
                $("#EventsFilter").hide();
                add_layers();
              //  plot_loop(dictionary);
                 
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
                addCustomMarker(dictionary);
                //for (var key in dictionary) {
                   // var dictValues = dictionary[key];
                    person_position=[25.296637, 51.517686];
                   // plot_marker(dictValues);
                    //console.log("person marker",key);
                    // plot_loop(dictionary);
//}

            } else {
                personLayer.clearLayers();                
                $("#spinnerContainer").hide();
               // plot_loop(dictionary);
                // for (var key in dictionary) {
                //     var dictValues = dictionary[key];
                //     plot_marker(dictValues);
                    //console.log("person marker",key);
               // }
            }
            plot_loop(dictionary);
            manageLayers(dictionary);
        });

        $("#defaultView").click(function(event) {
            var output9= '<div id="mainImage" class="sidebar-header header-cover box" style="background-image:linear-gradient(rgba(255,255,255,0), rgba(255,255,255,0)), url(logo/logo1.png);height:15vh;"><div class="resize" ></div></div>';
            $(".box").replaceWith(output9);
            
            ////console.log("clicked3rd?");
            var newID = event.target.id;
            map.setView([25.296637, 51.517686], 12, {
                animation: true,
                center: [25.296637, 51.517686]

            });
            // renderSwitches();
            manageLayers(dictionary)
        });


        $("#checkboxDateFilter").click(function(event) {
            if($("#checkboxDateFilter").is(':checked')) {$("#datetimepickers").show();}
            else{$("#datetimepickers").hide();}
            clear_layers();
            plot_loop(dictionary);
            manageLayers(dictionary);
        });


        plot_loop(dictionary);


    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        //console.log("Request Failed: " + err);
        // test = 7;
    });


// function background_images(dictionary)
// {
//    var output6='';//'<div class="sidebar-header header-cover" style="position: relative;height:50%;width:10%;margin:-3px -3px; display: inline-block; background-image: url(http://2.bp.blogspot.com/-2RewSLZUzRg/U-9o6SD4M6I/AAAAAAAADIE/voax99AbRx0/s1600/14%2B-%2B1%2B%281%29.jpg);"></div>';
//    for (var key in dictionary) {

//         var dictValues = dictionary[key];    
//         console.log(dictValues.image);        
//         var numberOfEvents = Events.length;
//         var width = $('#backgroundImages').width();
//         var height = $('#backgroundImages').height();
//         var sumRatio = width+height;
//         var widthRatio = (numberOfEvents*width)/sumRatio;
//         var heightRatio = (numberOfEvents*height)/sumRatio;
//         var widthAv = width/widthRatio;
//         var widthAv2 = (widthAv/width)*100;
//         var heightAv = height/heightAv;
//         //in %
//         var heightAv2 = (heightAv2/height)*100; 
//         var minWidth = widthAv2/6;
//         var maxWidth = widthAv2*(110/100);
//         var minHeight = heightAv2/20;
//         var maxHeight = heightAv2*(110/100);
//         var imageWidth = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
//         var imageHeight = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

//         output6+= '<div class="sidebar-header header-cover" style="position: relative;height:'+heightAv2+'%;width:'+widthAv2+'%;margin:-3px -3px; display: inline-block; background-image: url('+dictValues.image+');"> </div>'           

//   }
//   document.getElementById("backgroundImages").innerHTML = output6;

// }
var myint = "Suspendisse mauris. Fusce accumsan mollis eros. Pelloooooooooooooooooooooo entesque a diam sit amet mi ullamcorper vehicula. Integer adipiscin sem. Nullam quis massa sit amet nibh viverra malesuada. Nunc sem lacus, accumsan quis, faucibus non, congue vel, arcu, erisque hendrerit tellus. Integer sagittis. Vivamus a mauris eget arcu gravida tristique. Nunc iaculis mi in ante''''''''''''''''''''''''''''''''''''''''''''''''''''''''';;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;'llkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk";
console.log(adjust_string(myint,58));

function adjust_string(string,char_limit){
    var output7= '';
    var string2 = string.split(" ");
    var lengthCount = 0;
    //to keep track of empty spaces
    var wordCount = 0;
    for( var i in string2){
        if((lengthCount+string2[i].length)>(char_limit-wordCount))
        {            
            output7+='<br>'+' '+string2[i];
            lengthCount = string2[i].length;
            wordCount=0;
        }
        else{
            output7+=" "+string2[i];
            lengthCount+=string2[i].length;
            wordCount++;
          }
    }
    return output7;
    
}



console.log("width",$('#backgroundImages').width());
console.log("height",$('#backgroundImages').height());

function plot_loop(dictionary)
        {
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
        //
        //plot_marker(dictValues); //[25.296637, 51.517686]);        
        //  //console.log("dictValues",dictValues.coordinates);
        // carouselOutput2+= '<div class="item"  style="background-image: url('+dictValues.image+');"><img src="'+dictValues.image+'" /><div class="bs-slider-overlay"></div><div class="slide-text slide_style_left"><h1 data-animation="animated flipInX">'+dictValues.name+'</h1><p data-animation="animated lightSpeedIn">Description</p><a href="'+dictValues.link+'" target="_blank" class="btn btn-default" data-animation="animated fadeInUp">Go to Event Page</a></div></div>';
        // // <li data-target="#bootstrap-touch-slider" data-slide-to="0" class="active"></li>
        // carouselCounterOutput2+='<li data-target="#bootstrap-touch-slider" data-slide-to="'+carouselCount+'"></li>';

    }
    // renderCarouselCounter(carouselCounterOutput2);
    // renderCarousel(carouselOutput2);

}
//

function clear_layers() {
    // blueLayer.clearLayers();
    // redLayer.clearLayers();
    // orangeLayer.clearLayers();
    // greenLayer.clearLayers();
    // violetLayer.clearLayers();
    // greyLayer.clearLayers();
    manualLayer.clearLayers();
    for (var i = 0; i < color_array.length; i++) {
        // //console.log("color",color)

        eval(color_array[i] + "Layer").clearLayers();
    }
    //personLayer.clearLayers();
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
    //console.log(personMarker);
    personMarker.on('dragend', function(event) {
        clear_layers();
        var marker = event.target;
        person_position = marker.getLatLng();
        plot_loop(dictionary);
        //   alert(person_position);
        // for (var key in dictionary) {
        //     var dictValues = dictionary[key];
        //     plot_marker(dictValues);
        //     //console.log("person marker",key);
        // }
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
    console.log("offTime",offTime,offTime2);  
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

//console.log("convert",compare_time("12:40 PM","12:01 PM"));
//when 2nd & 3rd parameters are null checks with today's date
function is_valid_date(eventTiming, userStartTiming, userEndTiming) //ex: "2017-06-07 00:00:00 2017-05-21 00:00:00",06/14/2017 12:00 AM,06/28/2017 12:00 AM
{

    console.log('userStartTiming',userStartTiming,'userEndTiming',userEndTiming);
    if(userStartTiming!='' && userEndTiming==''){userEndTiming="02/26/4498 12:10 AM";}
        if(userStartTiming=='' && userEndTiming!=''){userStartTiming="03/01/0000 12:10 AM"}
    // var eventTiming="  2017-06-07 10:00:00 2017-05-21 17:00:00";

    var today = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var currentTime = new Date().toJSON().slice(11, 16);
    currentTime = to_12H(currentTime);


    eventTiming = $.trim(eventTiming);
    var eventSplit = eventTiming.split(" ");
    var eventStartDate = eventSplit[2];
    //eventStartDate=Date(eventStartDate);
    var eventEndDate = eventSplit[0];
    //eventEndDate = Date(eventEndDate);

    //Convert event time from 24H to 12H   
    var eventEndTime = to_12H(eventSplit[1]);
    var eventStartTime = to_12H(eventSplit[3]);
    //console.log("eventStartDate",eventStartDate);
    //console.log("eventEndTime",eventEndTime);
    //console.log("eventEndDate",eventEndDate);
    //console.log("eventStartTime",eventStartTime);
    //console.log("today",moment(eventEndDate,'YYYY-MM-DD').isBefore(eventStartDate,'YYYY-MM-DD'));
    //console.log("currentTime",compare_time(eventStartTime,eventEndTime));
    if (moment(eventEndDate, 'YYYY-MM-DD')<moment(eventStartDate, 'YYYY-MM-DD')) {
        return false;
    }
    if (moment(eventEndDate, 'YYYY-MM-DD')>=moment(eventStartDate,'YYYY-MM-DD') && moment(eventEndDate, 'YYYY-MM-DD')<=moment(eventStartDate,'YYYY-MM-DD') &&
        (compare_time(eventStartTime, eventEndTime) == 1)) {
        return false;
    }
    if ((userStartTiming == null||userStartTiming == "" )&& (userEndTiming == null || userEndTiming == "")) {
        if (moment(today, 'YYYY/MM/DD')>moment(eventEndDate, 'YYYY-MM-DD')) {
            return false;
        }
        if (moment(today,'YYYY/MM/DD')>=moment(eventEndDate, 'YYYY-MM-DD') && moment(today,'YYYY/MM/DD')<=moment(eventEndDate, 'YYYY-MM-DD') && compare_time(eventEndTime, currentTime) == 1) {
            return false;
        }
        return true;
    }
    //if(userStartTiming ==null){userStartTiming=}

    var userStartTimingSplit = userStartTiming.split(" ");
    console.log("userStartTimingSplit",userStartTimingSplit);
    var userStartDate = userStartTimingSplit[0];
    console.log("11");

    var userStartTime = userStartTimingSplit[1] + " " + userStartTimingSplit[2];
    console.log("12");
    var userEndTimingSplit = userEndTiming.split(" ");
    console.log("13");
    var userEndDate = userEndTimingSplit[0];
    console.log("14");
    var userEndTime = userEndTimingSplit[1] + " " + userEndTimingSplit[2];


    console.log("eventStartTime",eventStartTime);
    console.log("eventEndTime",eventEndTime);
    console.log("eventEndDate",eventEndDate);
    console.log("eventStartDate",eventStartDate);
    console.log("eventStartTime",eventStartTime);
    console.log("eventEndTime",eventEndTime);
    console.log("userStartDate",userStartDate);
    console.log("userEndDate",userEndDate);


    // console.log("today",currentTime,today);
    // console.log("eventEndDate > eventStartDate",moment(eventEndDate,'YYYY-MM-DD')>moment(eventStartDate,'YYYY-MM-DD'));    

    // if ((moment(userEndDate, 'MM/DD/YYYY').isBefore(userStartDate, 'MM/DD/YYYY'))) {
    //     alert("Not a valid time span");
    // }
    if ((moment(userEndDate, 'MM/DD/YYYY')<moment(userStartDate, 'MM/DD/YYYY'))) {
        alert("Not a valid time span");
    }

   console.log("1");

    // if (moment(userEndDate, 'MM/DD/YYYY').isSame(userStartDate, 'MM/DD/YYYY') &&
    //     compare_time(userStartTime, userEndTime) == 1) {
    //     alert("Not a valid time span");
    // }
    if (moment(userEndDate, 'MM/DD/YYYY')>=moment(userStartDate, 'MM/DD/YYYY') && moment(userEndDate, 'MM/DD/YYYY')<=moment(userStartDate, 'MM/DD/YYYY') &&
        compare_time(userStartTime, userEndTime) == 1) {
        alert("Not a valid time span");
    }
    console.log("2");

    // if (moment(userStartDate, 'MM/DD/YYYY').isSame(eventStartDate, 'YYYY-MM-DD') && (compare_time(eventEndTime, userStartTime) == 2)) {
    //     return false;
    // }

    if (moment(userEndDate, 'MM/DD/YYYY')>=moment(userStartDate, 'MM/DD/YYYY') && moment(userEndDate, 'MM/DD/YYYY')<=moment(userStartDate, 'MM/DD/YYYY') &&
        compare_time(userStartTime, userEndTime) == 1) {
        alert("Not a valid time span");
    }
    
    // if (moment(userEndDate, 'MM/DD/YYYY').isSame(eventEndDate, 'YYYY-MM-DD') && (compare_time(userEndTime, eventStartTime) == 2)) {
    //     return false;
    // }

    // if (moment(userEndDate, 'MM/DD/YYYY')==moment(eventEndDate, 'YYYY-MM-DD') && (compare_time(userEndTime, eventStartTime) == 2)) {
    //     return false;
    // }

    if(moment(userStartDate, 'MM/DD/YYYY')>= moment(eventStartDate, 'YYYY-MM-DD') && moment(userStartDate, 'MM/DD/YYYY')<= moment(eventStartDate, 'YYYY-MM-DD')
     && (compare_time(userStartTime, eventStartTime) == 1) ){return false;}
   console.log("3",moment(userEndDate, 'MM/DD/YYYY')==moment(userStartDate, 'MM/DD/YYYY'));
    if(moment(userEndDate, 'MM/DD/YYYY') >= moment(eventEndDate, 'YYYY-MM-DD') && moment(userEndDate, 'MM/DD/YYYY') <= moment(eventEndDate, 'YYYY-MM-DD') 
        && (compare_time(userEndTime, eventEndTime) == 2) ){return false;}
  // console.log(moment(userEndDate, 'MM/DD/YYYY')<= moment(eventEndDate, 'YYYY-MM-DD'));

    console.log('userEndDate',userEndDate)
    console.log( moment(eventStartDate, 'YYYY-MM-DD')<=moment(userEndDate, 'MM/DD/YYYY') )
    return moment(userStartDate, 'MM/DD/YYYY')<=moment(eventEndDate, 'YYYY-MM-DD') &&
            moment(eventStartDate, 'YYYY-MM-DD')<=moment(userEndDate, 'MM/DD/YYYY') &&
            moment(userEndDate, 'MM/DD/YYYY')>=moment(eventEndDate, 'YYYY-MM-DD') &&
            moment(eventStartDate, 'YYYY-MM-DD')>=moment(userStartDate, 'MM/DD/YYYY');
}


function plot_valid_date(dictionary, userStartTiming, userEndTiming) {
    clear_layers();
    for (var key in dictionary) {
        var dictValues = dictionary[key];
        //console.log("plot valid",dictValues.name,is_valid_date(dictValues.date,userStartTiming,userEndTiming));
        var dateValidity = is_valid_date(dictValues.date, userStartTiming, userEndTiming);
        // if ($("#checkboxCustom").is(':checked')) {
        //     if (dateValidity) {
                plot_marker(dictValues, dateValidity, userStartTiming, userEndTiming);
        //     }
        // }
        // else{
          //  plot_marker(dictValues, dateValidity, userStartTiming, userEndTiming);
       // }
    }
}


//converts date from YYYY-MM-DD to MM/DD/YYYY
function convert_date_format(date)
{
    var string = date.split('-');
    var date2 = string[1]+'/'+string[2]+'/'+string[0];
    return date2;
}



function plot_marker(eventDict) {
    //create popup message
    // if (!dateFilter) {
    //     return;
    // }
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
    ////console.log("mapArr", mapArr);
    //
    var latitude = eventDict.latitude;
    var longitude = eventDict.longitude;
    var marker = L.marker([latitude, longitude], {
        icon: event_icon
    }).bindPopup(string, {
        minWidth: 600
    });


    ////console.log("person_position22",person_position,get_distance(marker,person_position));

    if ($("#checkboxDateFilter").is(':checked'))  {
        if (is_valid_date(eventDict.date, document.getElementById("datetimepicker4").value, document.getElementById("datetimepicker5").value)) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
        } else {
            return;
          }
    }
    if ($("#checkboxCustom").is(':checked'))  {
        mapLayer.removeLayer(marker);
        if (get_distance(marker, person_position) < (document.getElementById("radiusSpinner").value)*1000) {
            marker.addTo(mapLayer);
            mapArr.push(marker);
        }
        else{
            return;
        }


    }
    else{ marker.addTo(mapLayer);
            mapArr.push(marker);}
}




function manageLayers(dictionary) {

     if (!($("#checkboxCategories").is(':checked'))){
        add_layers();
        return;
     }
    ////console.log("called",$("#someSwitchOptionPrimary").is(':checked'));
    // map.removeLayer(blueLayer);
    // map.addLayer(blueLayer); 

    // a = li[i].getElementsByTagName("a")[0];
    for (var i = 0; i < color_array.length; i++) {
        // //console.log("color",color)
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

function show_whole_list(){
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
    ////console.log("Events  ", Events);
    var output4;
    output4 = '';

    for (var i = 0; i < category_array.length; i++) {

        output4 += '<li><div class="checkbox checkbox-primary filter" ><div class="checkbox-' + color_array[i] + '"><input id="checkbox-' + color_array[i] + '" name=""checkbox-'+ color_array[i] + '" type="checkbox" checked="" ><label for="checkbox-' + color_array[i] + '" >' + category_array[i] + '</label></div></div></li>';
        document.getElementById("EventsFilter").innerHTML = output4;
        ////console.log("Events filter")
    }
}
//
function zoom_to_pin(dictionary, category_array, Event) {
    //add the event's pin with a popup
    clearManualLayer();
    var dictValues = dictionary[Event];

    var string = '';
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
    if (dictValues.event_date != null) {
        string += '<div class="popup_txt"> <strong>Date:</strong> ' + dictValues.event_date + '</div>';
    }
    if (dictValues.Starts != null) {
        string += '<div class="popup_txt"><strong> Starts at:</strong> ' + dictValues.Starts + '</div>';
    }
    if (dictValues.Ends != null) {
        string += '<div class="popup_txt"><strong>Ends at:</strong> ' + dictValues.Ends + '</div></br>';
    }
    ////console.log(dictValues)

    map.panTo([dictValues.latitude, dictValues.longitude], {
        center: [dictValues.latitude, dictValues.longitude]
    });
    map.setView([dictValues.latitude, dictValues.longitude], 16, {
        animation: true,
        center: [dictValues.latitude, dictValues.longitude]
    });
    var EventIndx = category_array.indexOf(dictValues.category);
    //console.log("index", category_array,EventIndx,dictValues.category);
    //
    var marker = L.marker([dictValues.latitude, dictValues.longitude], {
        icon: iconArr[EventIndx]
    }).bindPopup(string)
    marker.addTo(manualLayer).openPopup();
    manualArr.push(marker);

}


function listOfEvents() {
    ////console.log("Events  ", Events)
    var eventsListOutput;
    eventsListOutput = '';
    // if (Events.length) {
    //     eventsListOutput += '<li><a href="#" class="header">' + Events[0][0].toUpperCase() + '</a></li>';
    // }
    for (var i = 0; i < Events.length; i++) {
        // if (i > 0 && Events[i][0] != Events[i - 1][0]) {
        //     eventsListOutput += '<li ><a href="#" class="header">' + Events[i][0].toUpperCase() + '</a></li>';
        // }


        eventsListOutput += '<li class="eventItem" id="' + Events[i] + '"><a href="#">' + Events[i] + '</a></li>';

        // eventsListOutput += '<li class="nav-item" id="'+ Events[i] +'"><a class="nav-link" href="#" >' + Events[i] + '</a></li>';
        // eventsListOutput+='<li><a href="#" onmouseup=clearTimeout(myVar)'+'onmouseup="zoom_to_pin(\''+Events[i]+'\')">'+Events[i]+'</a></li>';
        //eventsListOutput+='<li><a href="#" '+'onmouseup="controlMap(\''+Events[i]+'\')">'+Events[i]+'</a></li>';
        // eventsListOutput += '<li><a href="#" ' + 'onmousedown="zoom_to_pin(\'' + Events[i] + '\')">' + Events[i] + '</a></li>';
        // eventsListOutput+='<li><a href="#" '+'onmouseup="zoom_to_pin('+Events[i]+')">'+Events[i]+'</a></li>';
        // eventsListOutput+='<li><a href="#">'+Events[i]+'</a></li>';
        //eventsListOutput+='<li><a href="#" '+'onmouseup="'+ EventZoom=Events[i]+')">'+Events[i]+'</a></li>';
    }
    document.getElementById("list_of_events").innerHTML = eventsListOutput;
}


// function renderCarouselCounter(carouselCounterOutput2){
//     var carouselCounterOutput=''
//     carouselCounterOutput+='<li data-target="#bootstrap-touch-slider" data-slide-to="0" class="active"></li>';
//     carouselCounterOutput+=carouselCounterOutput2;
//     document.getElementById("carouselCounter").innerHTML = carouselCounterOutput;

// }



//create the carousel
// function renderCarousel(carouselOutput2){
//     var carouselOutput='';
//     //create first defeault slide
//     carouselOutput+='<div id="carouselWrapper" class="carousel-inner" role="listbox"><div class="item active"><img src="https://www.visitqatar.qa/binaries/content/gallery/qatartourism/learn/essential-qatar/national-02-thumb.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/><div class="bs-slider-overlay"></div><div class="container"><div class="row"><div class="slide-text slide_style_center"><h1 data-animation="animated flipInX">Events in Qatar</h1></div></div></div></div>';
//     //create the rest of the slides
//    // for (var i=0; i<Events.length; i++) {
//     // carouselOutput2+= '<div class="item"><img src="'+dictValues.image+'" /><div class="bs-slider-overlay"></div><div class="slide-text slide_style_left"><h1 data-animation="animated flipInX">'+dictValues.name+'</h1><p data-animation="animated lightSpeedIn">Description</p><a href="'+dictValues.link+'" target="_blank" class="btn btn-default" data-animation="animated fadeInUp">Go to Event Page</a></div></div>';
//    // }
//    carouselOutput+=carouselOutput2;
//     carouselOutput+='</div>';
//    document.getElementById("carouselWrapper").innerHTML = carouselOutput;

// }


/*Bootstrap Carousel Touch Slider.

http://bootstrapthemes.co

Credits: Bootstrap, jQuery, TouchSwipe, Animate.css, FontAwesome

 */

// (function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{if(typeof module!=="undefined"&&module.exports){a(require("jquery"))}else{a(jQuery)}}}(function(f){var y="1.6.15",p="left",o="right",e="up",x="down",c="in",A="out",m="none",s="auto",l="swipe",t="pinch",B="tap",j="doubletap",b="longtap",z="hold",E="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!a,d=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!a,C="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:true};f.fn.swipe=function(H){var G=f(this),F=G.data(C);if(F&&typeof H==="string"){if(F[H]){return F[H].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+H+" does not exist on jQuery.swipe")}}else{if(F&&typeof H==="object"){F.option.apply(this,arguments)}else{if(!F&&(typeof H==="object"||!H)){return w.apply(this,arguments)}}}return G};f.fn.swipe.version=y;f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:A};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:E,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:i};function w(F){if(F&&(F.allowPageScroll===undefined&&(F.swipe!==undefined||F.swipeStatus!==undefined))){F.allowPageScroll=m}if(F.click!==undefined&&F.tap===undefined){F.tap=F.click}if(!F){F={}}F=f.extend({},f.fn.swipe.defaults,F);return this.each(function(){var H=f(this);var G=H.data(C);if(!G){G=new D(this,F);H.data(C,G)}})}function D(a5,au){var au=f.extend({},au);var az=(a||d||!au.fallbackToMouseEvents),K=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ax=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",V=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",T=az?(d?"mouseleave":null):"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,a2=null,ac=0,a1=0,aZ=0,H=1,ap=0,aJ=0,N=null;var aR=f(a5);var aa="start";var X=0;var aQ={};var U=0,a3=0,a6=0,ay=0,O=0;var aW=null,af=null;try{aR.bind(K,aN);aR.bind(aD,ba)}catch(aj){f.error("events not supported "+K+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(K,aN);aR.bind(aD,ba);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(C,null);aR=null};this.option=function(bd,bc){if(typeof bd==="object"){au=f.extend(au,bd)}else{if(au[bd]!==undefined){if(bc===undefined){return au[bd]}else{au[bd]=bc}}else{if(!bd){return au}else{f.error("Option "+bd+" does not exist on jQuery.swipe.options")}}}return null};function aN(be){if(aB()){return}if(f(be.target).closest(au.excludedElements,aR).length>0){return}var bf=be.originalEvent?be.originalEvent:be;var bd,bg=bf.touches,bc=bg?bg[0]:bf;aa=g;if(bg){X=bg.length}else{if(au.preventDefaultEvents!==false){be.preventDefault()}}ag=0;aP=null;a2=null;aJ=null;ac=0;a1=0;aZ=0;H=1;ap=0;N=ab();S();ai(0,bc);if(!bg||(X===au.fingers||au.fingers===i)||aX()){U=ar();if(X==2){ai(1,bg[1]);a1=aZ=at(aQ[0].start,aQ[1].start)}if(au.swipeStatus||au.pinchStatus){bd=P(bf,aa)}}else{bd=false}if(bd===false){aa=q;P(bf,aa);return bd}else{if(au.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[bf.target]);if(au.hold){bd=au.hold.call(aR,bf,bf.target)}},this),au.longTapThreshold)}an(true)}return null}function a4(bf){var bi=bf.originalEvent?bf.originalEvent:bf;if(aa===h||aa===q||al()){return}var be,bj=bi.touches,bd=bj?bj[0]:bi;var bg=aH(bd);a3=ar();if(bj){X=bj.length}if(au.hold){clearTimeout(af)}aa=k;if(X==2){if(a1==0){ai(1,bj[1]);a1=aZ=at(aQ[0].start,aQ[1].start)}else{aH(bj[1]);aZ=at(aQ[0].end,aQ[1].end);aJ=aq(aQ[0].end,aQ[1].end)}H=a8(a1,aZ);ap=Math.abs(a1-aZ)}if((X===au.fingers||au.fingers===i)||!bj||aX()){aP=aL(bg.start,bg.end);a2=aL(bg.last,bg.end);ak(bf,a2);ag=aS(bg.start,bg.end);ac=aM();aI(aP,ag);be=P(bi,aa);if(!au.triggerOnTouchEnd||au.triggerOnTouchLeave){var bc=true;if(au.triggerOnTouchLeave){var bh=aY(this);bc=F(bg.end,bh)}if(!au.triggerOnTouchEnd&&bc){aa=aC(k)}else{if(au.triggerOnTouchLeave&&!bc){aa=aC(h)}}if(aa==q||aa==h){P(bi,aa)}}}else{aa=q;P(bi,aa)}if(be===false){aa=q;P(bi,aa)}}function M(bc){var bd=bc.originalEvent?bc.originalEvent:bc,be=bd.touches;if(be){if(be.length&&!al()){G(bd);return true}else{if(be.length&&al()){return true}}}if(al()){X=ay}a3=ar();ac=aM();if(bb()||!am()){aa=q;P(bd,aa)}else{if(au.triggerOnTouchEnd||(au.triggerOnTouchEnd==false&&aa===k)){if(au.preventDefaultEvents!==false){bc.preventDefault()}aa=h;P(bd,aa)}else{if(!au.triggerOnTouchEnd&&a7()){aa=h;aF(bd,aa,B)}else{if(aa===k){aa=q;P(bd,aa)}}}}an(false);return null}function ba(){X=0;a3=0;U=0;a1=0;aZ=0;H=1;S();an(false)}function L(bc){var bd=bc.originalEvent?bc.originalEvent:bc;if(au.triggerOnTouchLeave){aa=aC(h);P(bd,aa)}}function aK(){aR.unbind(K,aN);aR.unbind(aD,ba);aR.unbind(ax,a4);aR.unbind(V,M);if(T){aR.unbind(T,L)}an(false)}function aC(bg){var bf=bg;var be=aA();var bd=am();var bc=bb();if(!be||bc){bf=q}else{if(bd&&bg==k&&(!au.triggerOnTouchEnd||au.triggerOnTouchLeave)){bf=h}else{if(!bd&&bg==h&&au.triggerOnTouchLeave){bf=q}}}return bf}function P(be,bc){var bd,bf=be.touches;if(J()||W()){bd=aF(be,bc,l)}if((Q()||aX())&&bd!==false){bd=aF(be,bc,t)}if(aG()&&bd!==false){bd=aF(be,bc,j)}else{if(ao()&&bd!==false){bd=aF(be,bc,b)}else{if(ah()&&bd!==false){bd=aF(be,bc,B)}}}if(bc===q){if(W()){bd=aF(be,bc,l)}if(aX()){bd=aF(be,bc,t)}ba(be)}if(bc===h){if(bf){if(!bf.length){ba(be)}}else{ba(be)}}return bd}function aF(bf,bc,be){var bd;if(be==l){aR.trigger("swipeStatus",[bc,aP||null,ag||0,ac||0,X,aQ,a2]);if(au.swipeStatus){bd=au.swipeStatus.call(aR,bf,bc,aP||null,ag||0,ac||0,X,aQ,a2);if(bd===false){return false}}if(bc==h&&aV()){clearTimeout(aW);clearTimeout(af);aR.trigger("swipe",[aP,ag,ac,X,aQ,a2]);if(au.swipe){bd=au.swipe.call(aR,bf,aP,ag,ac,X,aQ,a2);if(bd===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ac,X,aQ,a2]);if(au.swipeLeft){bd=au.swipeLeft.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case o:aR.trigger("swipeRight",[aP,ag,ac,X,aQ,a2]);if(au.swipeRight){bd=au.swipeRight.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case e:aR.trigger("swipeUp",[aP,ag,ac,X,aQ,a2]);if(au.swipeUp){bd=au.swipeUp.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case x:aR.trigger("swipeDown",[aP,ag,ac,X,aQ,a2]);if(au.swipeDown){bd=au.swipeDown.call(aR,bf,aP,ag,ac,X,aQ,a2)}break}}}if(be==t){aR.trigger("pinchStatus",[bc,aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchStatus){bd=au.pinchStatus.call(aR,bf,bc,aJ||null,ap||0,ac||0,X,H,aQ);if(bd===false){return false}}if(bc==h&&a9()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchIn){bd=au.pinchIn.call(aR,bf,aJ||null,ap||0,ac||0,X,H,aQ)}break;case A:aR.trigger("pinchOut",[aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchOut){bd=au.pinchOut.call(aR,bf,aJ||null,ap||0,ac||0,X,H,aQ)}break}}}if(be==B){if(bc===q||bc===h){clearTimeout(aW);clearTimeout(af);if(Z()&&!I()){O=ar();aW=setTimeout(f.proxy(function(){O=null;aR.trigger("tap",[bf.target]);if(au.tap){bd=au.tap.call(aR,bf,bf.target)}},this),au.doubleTapThreshold)}else{O=null;aR.trigger("tap",[bf.target]);if(au.tap){bd=au.tap.call(aR,bf,bf.target)}}}}else{if(be==j){if(bc===q||bc===h){clearTimeout(aW);clearTimeout(af);O=null;aR.trigger("doubletap",[bf.target]);if(au.doubleTap){bd=au.doubleTap.call(aR,bf,bf.target)}}}else{if(be==b){if(bc===q||bc===h){clearTimeout(aW);O=null;aR.trigger("longtap",[bf.target]);if(au.longTap){bd=au.longTap.call(aR,bf,bf.target)}}}}}return bd}function am(){var bc=true;if(au.threshold!==null){bc=ag>=au.threshold}return bc}function bb(){var bc=false;if(au.cancelThreshold!==null&&aP!==null){bc=(aT(aP)-ag)>=au.cancelThreshold}return bc}function ae(){if(au.pinchThreshold!==null){return ap>=au.pinchThreshold}return true}function aA(){var bc;if(au.maxTimeThreshold){if(ac>=au.maxTimeThreshold){bc=false}else{bc=true}}else{bc=true}return bc}function ak(bc,bd){if(au.preventDefaultEvents===false){return}if(au.allowPageScroll===m){bc.preventDefault()}else{var be=au.allowPageScroll===s;switch(bd){case p:if((au.swipeLeft&&be)||(!be&&au.allowPageScroll!=E)){bc.preventDefault()}break;case o:if((au.swipeRight&&be)||(!be&&au.allowPageScroll!=E)){bc.preventDefault()}break;case e:if((au.swipeUp&&be)||(!be&&au.allowPageScroll!=u)){bc.preventDefault()}break;case x:if((au.swipeDown&&be)||(!be&&au.allowPageScroll!=u)){bc.preventDefault()}break}}}function a9(){var bd=aO();var bc=Y();var be=ae();return bd&&bc&&be}function aX(){return !!(au.pinchStatus||au.pinchIn||au.pinchOut)}function Q(){return !!(a9()&&aX())}function aV(){var bf=aA();var bh=am();var be=aO();var bc=Y();var bd=bb();var bg=!bd&&bc&&be&&bh&&bf;return bg}function W(){return !!(au.swipe||au.swipeStatus||au.swipeLeft||au.swipeRight||au.swipeUp||au.swipeDown)}function J(){return !!(aV()&&W())}function aO(){return((X===au.fingers||au.fingers===i)||!a)}function Y(){return aQ[0].end.x!==0}function a7(){return !!(au.tap)}function Z(){return !!(au.doubleTap)}function aU(){return !!(au.longTap)}function R(){if(O==null){return false}var bc=ar();return(Z()&&((bc-O)<=au.doubleTapThreshold))}function I(){return R()}function aw(){return((X===1||!a)&&(isNaN(ag)||ag<au.threshold))}function a0(){return((ac>au.longTapThreshold)&&(ag<r))}function ah(){return !!(aw()&&a7())}function aG(){return !!(R()&&Z())}function ao(){return !!(a0()&&aU())}function G(bc){a6=ar();ay=bc.touches.length+1}function S(){a6=0;ay=0}function al(){var bc=false;if(a6){var bd=ar()-a6;if(bd<=au.fingerReleaseThreshold){bc=true}}return bc}function aB(){return !!(aR.data(C+"_intouch")===true)}function an(bc){if(!aR){return}if(bc===true){aR.bind(ax,a4);aR.bind(V,M);if(T){aR.bind(T,L)}}else{aR.unbind(ax,a4,false);aR.unbind(V,M,false);if(T){aR.unbind(T,L,false)}}aR.data(C+"_intouch",bc===true)}function ai(be,bc){var bd={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};bd.start.x=bd.last.x=bd.end.x=bc.pageX||bc.clientX;bd.start.y=bd.last.y=bd.end.y=bc.pageY||bc.clientY;aQ[be]=bd;return bd}function aH(bc){var be=bc.identifier!==undefined?bc.identifier:0;var bd=ad(be);if(bd===null){bd=ai(be,bc)}bd.last.x=bd.end.x;bd.last.y=bd.end.y;bd.end.x=bc.pageX||bc.clientX;bd.end.y=bc.pageY||bc.clientY;return bd}function ad(bc){return aQ[bc]||null}function aI(bc,bd){bd=Math.max(bd,aT(bc));N[bc].distance=bd}function aT(bc){if(N[bc]){return N[bc].distance}return undefined}function ab(){var bc={};bc[p]=av(p);bc[o]=av(o);bc[e]=av(e);bc[x]=av(x);return bc}function av(bc){return{direction:bc,distance:0}}function aM(){return a3-U}function at(bf,be){var bd=Math.abs(bf.x-be.x);var bc=Math.abs(bf.y-be.y);return Math.round(Math.sqrt(bd*bd+bc*bc))}function a8(bc,bd){var be=(bd/bc)*1;return be.toFixed(2)}function aq(){if(H<1){return A}else{return c}}function aS(bd,bc){return Math.round(Math.sqrt(Math.pow(bc.x-bd.x,2)+Math.pow(bc.y-bd.y,2)))}function aE(bf,bd){var bc=bf.x-bd.x;var bh=bd.y-bf.y;var be=Math.atan2(bh,bc);var bg=Math.round(be*180/Math.PI);if(bg<0){bg=360-Math.abs(bg)}return bg}function aL(bd,bc){var be=aE(bd,bc);if((be<=45)&&(be>=0)){return p}else{if((be<=360)&&(be>=315)){return p}else{if((be>=135)&&(be<=225)){return o}else{if((be>45)&&(be<135)){return x}else{return e}}}}}function ar(){var bc=new Date();return bc.getTime()}function aY(bc){bc=f(bc);var be=bc.offset();var bd={left:be.left,right:be.left+bc.outerWidth(),top:be.top,bottom:be.top+bc.outerHeight()};return bd}function F(bc,bd){return(bc.x>bd.left&&bc.x<bd.right&&bc.y>bd.top&&bc.y<bd.bottom)}}}));!function(n){"use strict";n.fn.bsTouchSlider=function(i){var a=n(".carousel");return this.each(function(){function i(i){var a="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";i.each(function(){var i=n(this),t=i.data("animation");i.addClass(t).one(a,function(){i.removeClass(t)})})}var t=a.find(".item:first").find("[data-animation ^= 'animated']");a.carousel(),i(t),a.on("slide.bs.carousel",function(a){var t=n(a.relatedTarget).find("[data-animation ^= 'animated']");i(t)}),n(".carousel .carousel-inner").swipe({swipeLeft:function(n,i,a,t,e){this.parent().carousel("next")},swipeRight:function(){this.parent().carousel("prev")},threshold:0})})}}(jQuery);

// $('#bootstrap-touch-slider').bsTouchSlider();