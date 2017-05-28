var EventZoom = 'none';
var zoomVal = 11;

var Events = [];
var dictionary;
var test = 0;
var CatArr = [];

//arrays of markers
var blueArr = [];
var redArr = [];
var orangeArr = [];
var greenArr = [];
var violetArr = [];
var greyArr = [];
var manualArr=[];

//marker colors
var blueIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-blue.png',
    shadowUrl: 'img/marker-shadow.png',
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
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#27AB27'
});

var orangeIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-orange.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CC8325'
});

var yellowIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-yellow.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#CAC428'
});

var violetIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-violet.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#9A26C9'
});

var greyIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-grey.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#777777'
});

var blackIcon = new L.Icon({
    iconUrl: 'img/marker-icon-2x-black.png',
    shadowUrl: 'img/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
    colVal: '#3C3C3C'
});
//Reference :https://github.com/pointhi/leaflet-color-markers

var iconArr = [blueIcon, redIcon, greenIcon, orangeIcon, violetIcon, greyIcon]; //,yellowIcon,blackIcon
//corresponding color values
//var ColDict=['#2681C8','#C82739','#27AB27','#CC8325','#CAC428','#9A26C9','#777777','#3C3C3C']
var ColDict = ["primary", "danger", "success", "warning", "info", "default"]; //length=7
var colArr = ['blue', 'red', 'green', 'orange', 'violet', 'grey'];

//create map layer for each category
var blueLayer = new L.LayerGroup();
var redLayer = new L.LayerGroup();
var greenLayer = new L.LayerGroup();
var orangeLayer = new L.LayerGroup();
var violetLayer = new L.LayerGroup();
var greyLayer = new L.LayerGroup();
var manualLayer = new L.LayerGroup();

// initializing the map 
var map = L.map('mapid', {
    center: [25.296637, 51.517686],
    zoom: 12,
    layers: [blueLayer, redLayer, greenLayer, orangeLayer, violetLayer, greyLayer,manualLayer]
});
L.tileLayer('https://api.mapbox.com/styles/v1/n-alathba/cj2fzxjgl00bl2rqno6mtb9wg/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1Ijoibi1hbGF0aGJhIiwiYSI6ImNqMmZ6bTQ2cDAwNDIyeW8wY2hidjFxdjUifQ.TyQ2WNEMtCO3Q84PYXlAEA', {
    attribution: 'Tiles by <a href="http://mapc.org">MAPC</a>, Data by <a href="http://mass.gov/mgis">MassGIS</a>',
    maxZoom: 18,
    minZoom: 1,
}).addTo(map);

// get JSON file (to be change to get the data from web-services or mongoDB)
var link_to_data = "./data/json_example2.json";
//console.log(link_to_data);

$.getJSON(link_to_data)
    .done(function(dictionary) {
        //console.log("DEBUGs:", dictionary); // Object.values(data[Object.keys(data)[0]]));
        test = 6;
        processData(dictionary);
        //
        renderSwitches();
        //
        listOfEvents();
        //
        manageLayers(); 
        $("li").click(function(event) {
            //console.log("clickedfirst?");
            var newID = event.target.id;
            for (var i = 0; i < Events.length; i++) {
                if (this.id == Events[i]) {
                    match(dictionary, CatArr, Events[i]);
                }
            }

        });
        $(".material-switch").click(function(event) {
            //console.log("clicked2nd?");
            var newID = event.target.id;
            //console.log("switch")
            manageLayers();   
            clearManualLayer();
        });

        $(document).ready(function() {
            $("#myInput").keyup(function() {
                myFunction();
            });
        });
        $("#defaultView").click(function(event) {
            //console.log("clicked3rd?");
            var newID = event.target.id;
            map.setView([25.296637, 51.517686],12, {
                animation: true,
                center: [25.296637, 51.517686]

            });
            // renderSwitches();
            manageLayers()
        });
    })
    .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
        // test = 7;
});
//
function processData(dictionary) {
    var carouselOutput2='';
    var carouselCount=0;
    var carouselCounterOutput2=''
    //create array of events
    for (var key in dictionary) {
        var dictValues = dictionary[key];
        //populates Events[]
        Events.push(key);
        if (!CatArr.includes(dictValues.category)) {
            CatArr.push(dictValues.category);
        }
        //
        plot_marker(dictValues);        
        console.log("dictValues",dictValues);
        carouselOutput2+= '<div class="item"  style="background-image: url('+dictValues.image+');"><img src="'+dictValues.image+'" /><div class="bs-slider-overlay"></div><div class="slide-text slide_style_left"><h1 data-animation="animated flipInX">'+dictValues.name+'</h1><p data-animation="animated lightSpeedIn">Description</p><a href="'+dictValues.link+'" target="_blank" class="btn btn-default" data-animation="animated fadeInUp">Go to Event Page</a></div></div>';
        // <li data-target="#bootstrap-touch-slider" data-slide-to="0" class="active"></li>
        carouselCounterOutput2+='<li data-target="#bootstrap-touch-slider" data-slide-to="'+carouselCount+'"></li>';
       
    }
    renderCarouselCounter(carouselCounterOutput2);
    renderCarousel(carouselOutput2);

}
//
function plot_marker(eventDict) {
    //create popup message
    var string='';
    if (eventDict.image != null) {
        string +='<div><img src="'+eventDict.image+'" style="width:100%;"></br></div><br>';
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
        string +='<div class="popup_txt"> <strong>Hosted by:</strong> ' + eventDict.event_venue+'</div>';
    }
    if (eventDict.event_date != null) {
        string +=  '<div class="popup_txt"> <strong>Date:</strong> ' + eventDict.event_date+'</div>';
    }
    if (eventDict.Starts != null) {
        string += '<div class="popup_txt"><strong> Starts at:</strong> ' + eventDict.Starts+'</div>';
    }
    if (eventDict.Ends != null) {
        string += '<div class="popup_txt"><strong>Ends at:</strong> ' + eventDict.Ends+'</div></br>';
    }
    

    //
    var eventIndx = CatArr.indexOf(eventDict.category);
    var event_icon = iconArr[eventIndx];
    var mapArr = eval(colArr[eventIndx] + 'Arr');
    var mapLayer = eval(colArr[eventIndx] + 'Layer');
    //console.log("mapArr", mapArr);
    //
    var latitude = eventDict.latitude;
    var longitude = eventDict.longitude;
    var marker = L.marker([latitude, longitude], {
        icon: event_icon
    }).bindPopup(string,{minWidth:600});
    marker.addTo(mapLayer);
    mapArr.push(marker);
}
//
function manageLayers(){
    //console.log("called",$("#someSwitchOptionPrimary").is(':checked'));
    // map.removeLayer(blueLayer);
    // map.addLayer(blueLayer); 
    if($("#someSwitchOptionPrimary").is(':checked')){map.addLayer(blueLayer);}
    else{map.removeLayer(blueLayer);}

    if($("#someSwitchOptionDefault").is(':checked')){map.addLayer(greyLayer);}
    else{map.removeLayer(greyLayer);}

    if($("#someSwitchOptionSuccess").is(':checked')){map.addLayer(greenLayer);}
    else{map.removeLayer(greenLayer);}

    if($("#someSwitchOptionDanger").is(':checked')){map.addLayer(redLayer);}
    else{map.removeLayer(redLayer);}

    if($("#someSwitchOptionWarning").is(':checked')){map.addLayer(orangeLayer);}
    else{map.removeLayer(orangeLayer);}

    if($("#someSwitchOptionInfo").is(':checked')){map.addLayer(violetLayer);}
    else{map.removeLayer(violetLayer);}
    
    
}

function clearManualLayer(){
    for (var i=0; i<manualArr.length; i++) {
        manualLayer.removeLayer(manualArr[i]);
    }

}

//adds checkbox
function renderSwitches() {
    //console.log("Events  ", Events);
    var output4;
    output4 = '';

    for (var i = 0; i < CatArr.length; i++) {
        output4 += ' <li class="CBtxt">' + CatArr[i] + ' <div class="material-switch pull-right CB" >';
        if (ColDict[i] == "default") {
            output4 += '<input id="someSwitchOptionDefault" name="someSwitchOption001" type="checkbox" checked="checked"/><label for="someSwitchOptionDefault" class="label-default"></label></div></li>';
        }
        if (ColDict[i] == "success") {
            output4 += '<input id="someSwitchOptionSuccess" name="someSwitchOption001" type="checkbox" checked="checked" /><label for="someSwitchOptionSuccess" class="label-success"></label></div></li>';
        }
        if (ColDict[i] == "primary") {
            output4 += '<input id="someSwitchOptionPrimary" name="someSwitchOption001" type="checkbox" checked="checked" /><label for="someSwitchOptionPrimary" class="label-primary"></label></div></li>';
        }
        if (ColDict[i] == "danger") {
            output4 += '<input id="someSwitchOptionDanger" name="someSwitchOption001" type="checkbox" checked="checked" /><label for="someSwitchOptionDanger" class="label-danger"></label></div></li>';
        }
        if (ColDict[i] == "warning") {
            output4 += '<input id="someSwitchOptionWarning" name="someSwitchOption001" type="checkbox" checked="checked" /><label for="someSwitchOptionWarning" class="label-warning"></label></div></li>';
        }
        if (ColDict[i] == "info") {
            output4 += '<input id="someSwitchOptionInfo" name="someSwitchOption001" type="checkbox" checked="checked"/><label for="someSwitchOptionInfo" class="label-info"></label></div></li>';
        }
        document.getElementById("EventsFilter").innerHTML = output4;
        //console.log("Events filter")
    }
}
//
function match(dictionary, CatArr, Event) {
    //add the event's pin with a popup
    clearManualLayer();
    var dictValues = dictionary[Event];

    var string='';
    if (dictValues.image != null) {
        string +='<div><img src="'+dictValues.image+'" style="width:100%;"></br></div><br>';
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
        string +='<div class="popup_txt"> <strong>Hosted by:</strong> ' + dictValues.event_venue+'</div>';
    }
    if (dictValues.event_date != null) {
        string +=  '<div class="popup_txt"> <strong>Date:</strong> ' + dictValues.event_date+'</div>';
    }
    if (dictValues.Starts != null) {
        string += '<div class="popup_txt"><strong> Starts at:</strong> ' + dictValues.Starts+'</div>';
    }
    if (dictValues.Ends != null) {
        string += '<div class="popup_txt"><strong>Ends at:</strong> ' + dictValues.Ends+'</div></br>';
    }
    //console.log(dictValues)
    map.panTo([dictValues.latitude, dictValues.longitude], {
        center: [dictValues.latitude, dictValues.longitude]
    });
    map.setView([dictValues.latitude, dictValues.longitude], 16, {
        animation: true,
        center: [dictValues.latitude, dictValues.longitude]
    });
    var EventIndx = CatArr.indexOf(Object.values(dictionary[Event])[8]);
    //console.log("index", EventIndx);
    //
    var marker = L.marker([dictValues.latitude, dictValues.longitude], {
            icon: iconArr[EventIndx]
        }).bindPopup(string)
        marker.addTo(manualLayer).openPopup();;
    manualArr.push(marker);

}

//search 
function myFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("myInput");
    filter = input.value.toUpperCase();
    ul = document.getElementById("myUL");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}
//
$(function() {
    $('.navbar-toggle').click(function() {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);
    });
    // Remove menu for searching
    $('#search-trigger').click(function() {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');
    });
});



function listOfEvents() {
    //console.log("Events  ", Events)
    var eventsListOutput;
    eventsListOutput = '';
    // if (Events.length) {
    //     eventsListOutput += '<li><a href="#" class="header">' + Events[0][0].toUpperCase() + '</a></li>';
    // }
    for (var i = 0; i < Events.length; i++) {
        // if (i > 0 && Events[i][0] != Events[i - 1][0]) {
        //     eventsListOutput += '<li ><a href="#" class="header">' + Events[i][0].toUpperCase() + '</a></li>';
        // }
        eventsListOutput += '<li class="nav-item" id="' + Events[i] + '"><a class="nav-link" href="#" >' + Events[i] + '</a></li>';
        // eventsListOutput+='<li><a href="#" onmouseup=clearTimeout(myVar)'+'onmouseup="match(\''+Events[i]+'\')">'+Events[i]+'</a></li>';
        //eventsListOutput+='<li><a href="#" '+'onmouseup="controlMap(\''+Events[i]+'\')">'+Events[i]+'</a></li>';
        // eventsListOutput += '<li><a href="#" ' + 'onmousedown="match(\'' + Events[i] + '\')">' + Events[i] + '</a></li>';
        // eventsListOutput+='<li><a href="#" '+'onmouseup="match('+Events[i]+')">'+Events[i]+'</a></li>';
        // eventsListOutput+='<li><a href="#">'+Events[i]+'</a></li>';
        //eventsListOutput+='<li><a href="#" '+'onmouseup="'+ EventZoom=Events[i]+')">'+Events[i]+'</a></li>';
    }
     document.getElementById("myUL").innerHTML = eventsListOutput;
}


function renderCarouselCounter(carouselCounterOutput2){
    var carouselCounterOutput=''
    carouselCounterOutput+='<li data-target="#bootstrap-touch-slider" data-slide-to="0" class="active"></li>';
    carouselCounterOutput+=carouselCounterOutput2;
    document.getElementById("carouselCounter").innerHTML = carouselCounterOutput;

}



//create the carousel
function renderCarousel(carouselOutput2){
    var carouselOutput='';
    //create first defeault slide
    carouselOutput+='<div id="carouselWrapper" class="carousel-inner" role="listbox"><div class="item active"><img src="https://www.visitqatar.qa/binaries/content/gallery/qatartourism/learn/essential-qatar/national-02-thumb.jpg" alt="Bootstrap Touch Slider"  class="slide-image"/><div class="bs-slider-overlay"></div><div class="container"><div class="row"><div class="slide-text slide_style_center"><h1 data-animation="animated flipInX">Events in Qatar</h1></div></div></div></div>';
    //create the rest of the slides
   // for (var i=0; i<Events.length; i++) {
    // carouselOutput2+= '<div class="item"><img src="'+dictValues.image+'" /><div class="bs-slider-overlay"></div><div class="slide-text slide_style_left"><h1 data-animation="animated flipInX">'+dictValues.name+'</h1><p data-animation="animated lightSpeedIn">Description</p><a href="'+dictValues.link+'" target="_blank" class="btn btn-default" data-animation="animated fadeInUp">Go to Event Page</a></div></div>';
   // }
   carouselOutput+=carouselOutput2;
    carouselOutput+='</div>';
   document.getElementById("carouselWrapper").innerHTML = carouselOutput;

}


    /*Bootstrap Carousel Touch Slider.

http://bootstrapthemes.co

Credits: Bootstrap, jQuery, TouchSwipe, Animate.css, FontAwesome

 */

(function(a){if(typeof define==="function"&&define.amd&&define.amd.jQuery){define(["jquery"],a)}else{if(typeof module!=="undefined"&&module.exports){a(require("jquery"))}else{a(jQuery)}}}(function(f){var y="1.6.15",p="left",o="right",e="up",x="down",c="in",A="out",m="none",s="auto",l="swipe",t="pinch",B="tap",j="doubletap",b="longtap",z="hold",E="horizontal",u="vertical",i="all",r=10,g="start",k="move",h="end",q="cancel",a="ontouchstart" in window,v=window.navigator.msPointerEnabled&&!window.navigator.pointerEnabled&&!a,d=(window.navigator.pointerEnabled||window.navigator.msPointerEnabled)&&!a,C="TouchSwipe";var n={fingers:1,threshold:75,cancelThreshold:null,pinchThreshold:20,maxTimeThreshold:null,fingerReleaseThreshold:250,longTapThreshold:500,doubleTapThreshold:200,swipe:null,swipeLeft:null,swipeRight:null,swipeUp:null,swipeDown:null,swipeStatus:null,pinchIn:null,pinchOut:null,pinchStatus:null,click:null,tap:null,doubleTap:null,longTap:null,hold:null,triggerOnTouchEnd:true,triggerOnTouchLeave:false,allowPageScroll:"auto",fallbackToMouseEvents:true,excludedElements:"label, button, input, select, textarea, a, .noSwipe",preventDefaultEvents:true};f.fn.swipe=function(H){var G=f(this),F=G.data(C);if(F&&typeof H==="string"){if(F[H]){return F[H].apply(this,Array.prototype.slice.call(arguments,1))}else{f.error("Method "+H+" does not exist on jQuery.swipe")}}else{if(F&&typeof H==="object"){F.option.apply(this,arguments)}else{if(!F&&(typeof H==="object"||!H)){return w.apply(this,arguments)}}}return G};f.fn.swipe.version=y;f.fn.swipe.defaults=n;f.fn.swipe.phases={PHASE_START:g,PHASE_MOVE:k,PHASE_END:h,PHASE_CANCEL:q};f.fn.swipe.directions={LEFT:p,RIGHT:o,UP:e,DOWN:x,IN:c,OUT:A};f.fn.swipe.pageScroll={NONE:m,HORIZONTAL:E,VERTICAL:u,AUTO:s};f.fn.swipe.fingers={ONE:1,TWO:2,THREE:3,FOUR:4,FIVE:5,ALL:i};function w(F){if(F&&(F.allowPageScroll===undefined&&(F.swipe!==undefined||F.swipeStatus!==undefined))){F.allowPageScroll=m}if(F.click!==undefined&&F.tap===undefined){F.tap=F.click}if(!F){F={}}F=f.extend({},f.fn.swipe.defaults,F);return this.each(function(){var H=f(this);var G=H.data(C);if(!G){G=new D(this,F);H.data(C,G)}})}function D(a5,au){var au=f.extend({},au);var az=(a||d||!au.fallbackToMouseEvents),K=az?(d?(v?"MSPointerDown":"pointerdown"):"touchstart"):"mousedown",ax=az?(d?(v?"MSPointerMove":"pointermove"):"touchmove"):"mousemove",V=az?(d?(v?"MSPointerUp":"pointerup"):"touchend"):"mouseup",T=az?(d?"mouseleave":null):"mouseleave",aD=(d?(v?"MSPointerCancel":"pointercancel"):"touchcancel");var ag=0,aP=null,a2=null,ac=0,a1=0,aZ=0,H=1,ap=0,aJ=0,N=null;var aR=f(a5);var aa="start";var X=0;var aQ={};var U=0,a3=0,a6=0,ay=0,O=0;var aW=null,af=null;try{aR.bind(K,aN);aR.bind(aD,ba)}catch(aj){f.error("events not supported "+K+","+aD+" on jQuery.swipe")}this.enable=function(){aR.bind(K,aN);aR.bind(aD,ba);return aR};this.disable=function(){aK();return aR};this.destroy=function(){aK();aR.data(C,null);aR=null};this.option=function(bd,bc){if(typeof bd==="object"){au=f.extend(au,bd)}else{if(au[bd]!==undefined){if(bc===undefined){return au[bd]}else{au[bd]=bc}}else{if(!bd){return au}else{f.error("Option "+bd+" does not exist on jQuery.swipe.options")}}}return null};function aN(be){if(aB()){return}if(f(be.target).closest(au.excludedElements,aR).length>0){return}var bf=be.originalEvent?be.originalEvent:be;var bd,bg=bf.touches,bc=bg?bg[0]:bf;aa=g;if(bg){X=bg.length}else{if(au.preventDefaultEvents!==false){be.preventDefault()}}ag=0;aP=null;a2=null;aJ=null;ac=0;a1=0;aZ=0;H=1;ap=0;N=ab();S();ai(0,bc);if(!bg||(X===au.fingers||au.fingers===i)||aX()){U=ar();if(X==2){ai(1,bg[1]);a1=aZ=at(aQ[0].start,aQ[1].start)}if(au.swipeStatus||au.pinchStatus){bd=P(bf,aa)}}else{bd=false}if(bd===false){aa=q;P(bf,aa);return bd}else{if(au.hold){af=setTimeout(f.proxy(function(){aR.trigger("hold",[bf.target]);if(au.hold){bd=au.hold.call(aR,bf,bf.target)}},this),au.longTapThreshold)}an(true)}return null}function a4(bf){var bi=bf.originalEvent?bf.originalEvent:bf;if(aa===h||aa===q||al()){return}var be,bj=bi.touches,bd=bj?bj[0]:bi;var bg=aH(bd);a3=ar();if(bj){X=bj.length}if(au.hold){clearTimeout(af)}aa=k;if(X==2){if(a1==0){ai(1,bj[1]);a1=aZ=at(aQ[0].start,aQ[1].start)}else{aH(bj[1]);aZ=at(aQ[0].end,aQ[1].end);aJ=aq(aQ[0].end,aQ[1].end)}H=a8(a1,aZ);ap=Math.abs(a1-aZ)}if((X===au.fingers||au.fingers===i)||!bj||aX()){aP=aL(bg.start,bg.end);a2=aL(bg.last,bg.end);ak(bf,a2);ag=aS(bg.start,bg.end);ac=aM();aI(aP,ag);be=P(bi,aa);if(!au.triggerOnTouchEnd||au.triggerOnTouchLeave){var bc=true;if(au.triggerOnTouchLeave){var bh=aY(this);bc=F(bg.end,bh)}if(!au.triggerOnTouchEnd&&bc){aa=aC(k)}else{if(au.triggerOnTouchLeave&&!bc){aa=aC(h)}}if(aa==q||aa==h){P(bi,aa)}}}else{aa=q;P(bi,aa)}if(be===false){aa=q;P(bi,aa)}}function M(bc){var bd=bc.originalEvent?bc.originalEvent:bc,be=bd.touches;if(be){if(be.length&&!al()){G(bd);return true}else{if(be.length&&al()){return true}}}if(al()){X=ay}a3=ar();ac=aM();if(bb()||!am()){aa=q;P(bd,aa)}else{if(au.triggerOnTouchEnd||(au.triggerOnTouchEnd==false&&aa===k)){if(au.preventDefaultEvents!==false){bc.preventDefault()}aa=h;P(bd,aa)}else{if(!au.triggerOnTouchEnd&&a7()){aa=h;aF(bd,aa,B)}else{if(aa===k){aa=q;P(bd,aa)}}}}an(false);return null}function ba(){X=0;a3=0;U=0;a1=0;aZ=0;H=1;S();an(false)}function L(bc){var bd=bc.originalEvent?bc.originalEvent:bc;if(au.triggerOnTouchLeave){aa=aC(h);P(bd,aa)}}function aK(){aR.unbind(K,aN);aR.unbind(aD,ba);aR.unbind(ax,a4);aR.unbind(V,M);if(T){aR.unbind(T,L)}an(false)}function aC(bg){var bf=bg;var be=aA();var bd=am();var bc=bb();if(!be||bc){bf=q}else{if(bd&&bg==k&&(!au.triggerOnTouchEnd||au.triggerOnTouchLeave)){bf=h}else{if(!bd&&bg==h&&au.triggerOnTouchLeave){bf=q}}}return bf}function P(be,bc){var bd,bf=be.touches;if(J()||W()){bd=aF(be,bc,l)}if((Q()||aX())&&bd!==false){bd=aF(be,bc,t)}if(aG()&&bd!==false){bd=aF(be,bc,j)}else{if(ao()&&bd!==false){bd=aF(be,bc,b)}else{if(ah()&&bd!==false){bd=aF(be,bc,B)}}}if(bc===q){if(W()){bd=aF(be,bc,l)}if(aX()){bd=aF(be,bc,t)}ba(be)}if(bc===h){if(bf){if(!bf.length){ba(be)}}else{ba(be)}}return bd}function aF(bf,bc,be){var bd;if(be==l){aR.trigger("swipeStatus",[bc,aP||null,ag||0,ac||0,X,aQ,a2]);if(au.swipeStatus){bd=au.swipeStatus.call(aR,bf,bc,aP||null,ag||0,ac||0,X,aQ,a2);if(bd===false){return false}}if(bc==h&&aV()){clearTimeout(aW);clearTimeout(af);aR.trigger("swipe",[aP,ag,ac,X,aQ,a2]);if(au.swipe){bd=au.swipe.call(aR,bf,aP,ag,ac,X,aQ,a2);if(bd===false){return false}}switch(aP){case p:aR.trigger("swipeLeft",[aP,ag,ac,X,aQ,a2]);if(au.swipeLeft){bd=au.swipeLeft.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case o:aR.trigger("swipeRight",[aP,ag,ac,X,aQ,a2]);if(au.swipeRight){bd=au.swipeRight.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case e:aR.trigger("swipeUp",[aP,ag,ac,X,aQ,a2]);if(au.swipeUp){bd=au.swipeUp.call(aR,bf,aP,ag,ac,X,aQ,a2)}break;case x:aR.trigger("swipeDown",[aP,ag,ac,X,aQ,a2]);if(au.swipeDown){bd=au.swipeDown.call(aR,bf,aP,ag,ac,X,aQ,a2)}break}}}if(be==t){aR.trigger("pinchStatus",[bc,aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchStatus){bd=au.pinchStatus.call(aR,bf,bc,aJ||null,ap||0,ac||0,X,H,aQ);if(bd===false){return false}}if(bc==h&&a9()){switch(aJ){case c:aR.trigger("pinchIn",[aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchIn){bd=au.pinchIn.call(aR,bf,aJ||null,ap||0,ac||0,X,H,aQ)}break;case A:aR.trigger("pinchOut",[aJ||null,ap||0,ac||0,X,H,aQ]);if(au.pinchOut){bd=au.pinchOut.call(aR,bf,aJ||null,ap||0,ac||0,X,H,aQ)}break}}}if(be==B){if(bc===q||bc===h){clearTimeout(aW);clearTimeout(af);if(Z()&&!I()){O=ar();aW=setTimeout(f.proxy(function(){O=null;aR.trigger("tap",[bf.target]);if(au.tap){bd=au.tap.call(aR,bf,bf.target)}},this),au.doubleTapThreshold)}else{O=null;aR.trigger("tap",[bf.target]);if(au.tap){bd=au.tap.call(aR,bf,bf.target)}}}}else{if(be==j){if(bc===q||bc===h){clearTimeout(aW);clearTimeout(af);O=null;aR.trigger("doubletap",[bf.target]);if(au.doubleTap){bd=au.doubleTap.call(aR,bf,bf.target)}}}else{if(be==b){if(bc===q||bc===h){clearTimeout(aW);O=null;aR.trigger("longtap",[bf.target]);if(au.longTap){bd=au.longTap.call(aR,bf,bf.target)}}}}}return bd}function am(){var bc=true;if(au.threshold!==null){bc=ag>=au.threshold}return bc}function bb(){var bc=false;if(au.cancelThreshold!==null&&aP!==null){bc=(aT(aP)-ag)>=au.cancelThreshold}return bc}function ae(){if(au.pinchThreshold!==null){return ap>=au.pinchThreshold}return true}function aA(){var bc;if(au.maxTimeThreshold){if(ac>=au.maxTimeThreshold){bc=false}else{bc=true}}else{bc=true}return bc}function ak(bc,bd){if(au.preventDefaultEvents===false){return}if(au.allowPageScroll===m){bc.preventDefault()}else{var be=au.allowPageScroll===s;switch(bd){case p:if((au.swipeLeft&&be)||(!be&&au.allowPageScroll!=E)){bc.preventDefault()}break;case o:if((au.swipeRight&&be)||(!be&&au.allowPageScroll!=E)){bc.preventDefault()}break;case e:if((au.swipeUp&&be)||(!be&&au.allowPageScroll!=u)){bc.preventDefault()}break;case x:if((au.swipeDown&&be)||(!be&&au.allowPageScroll!=u)){bc.preventDefault()}break}}}function a9(){var bd=aO();var bc=Y();var be=ae();return bd&&bc&&be}function aX(){return !!(au.pinchStatus||au.pinchIn||au.pinchOut)}function Q(){return !!(a9()&&aX())}function aV(){var bf=aA();var bh=am();var be=aO();var bc=Y();var bd=bb();var bg=!bd&&bc&&be&&bh&&bf;return bg}function W(){return !!(au.swipe||au.swipeStatus||au.swipeLeft||au.swipeRight||au.swipeUp||au.swipeDown)}function J(){return !!(aV()&&W())}function aO(){return((X===au.fingers||au.fingers===i)||!a)}function Y(){return aQ[0].end.x!==0}function a7(){return !!(au.tap)}function Z(){return !!(au.doubleTap)}function aU(){return !!(au.longTap)}function R(){if(O==null){return false}var bc=ar();return(Z()&&((bc-O)<=au.doubleTapThreshold))}function I(){return R()}function aw(){return((X===1||!a)&&(isNaN(ag)||ag<au.threshold))}function a0(){return((ac>au.longTapThreshold)&&(ag<r))}function ah(){return !!(aw()&&a7())}function aG(){return !!(R()&&Z())}function ao(){return !!(a0()&&aU())}function G(bc){a6=ar();ay=bc.touches.length+1}function S(){a6=0;ay=0}function al(){var bc=false;if(a6){var bd=ar()-a6;if(bd<=au.fingerReleaseThreshold){bc=true}}return bc}function aB(){return !!(aR.data(C+"_intouch")===true)}function an(bc){if(!aR){return}if(bc===true){aR.bind(ax,a4);aR.bind(V,M);if(T){aR.bind(T,L)}}else{aR.unbind(ax,a4,false);aR.unbind(V,M,false);if(T){aR.unbind(T,L,false)}}aR.data(C+"_intouch",bc===true)}function ai(be,bc){var bd={start:{x:0,y:0},last:{x:0,y:0},end:{x:0,y:0}};bd.start.x=bd.last.x=bd.end.x=bc.pageX||bc.clientX;bd.start.y=bd.last.y=bd.end.y=bc.pageY||bc.clientY;aQ[be]=bd;return bd}function aH(bc){var be=bc.identifier!==undefined?bc.identifier:0;var bd=ad(be);if(bd===null){bd=ai(be,bc)}bd.last.x=bd.end.x;bd.last.y=bd.end.y;bd.end.x=bc.pageX||bc.clientX;bd.end.y=bc.pageY||bc.clientY;return bd}function ad(bc){return aQ[bc]||null}function aI(bc,bd){bd=Math.max(bd,aT(bc));N[bc].distance=bd}function aT(bc){if(N[bc]){return N[bc].distance}return undefined}function ab(){var bc={};bc[p]=av(p);bc[o]=av(o);bc[e]=av(e);bc[x]=av(x);return bc}function av(bc){return{direction:bc,distance:0}}function aM(){return a3-U}function at(bf,be){var bd=Math.abs(bf.x-be.x);var bc=Math.abs(bf.y-be.y);return Math.round(Math.sqrt(bd*bd+bc*bc))}function a8(bc,bd){var be=(bd/bc)*1;return be.toFixed(2)}function aq(){if(H<1){return A}else{return c}}function aS(bd,bc){return Math.round(Math.sqrt(Math.pow(bc.x-bd.x,2)+Math.pow(bc.y-bd.y,2)))}function aE(bf,bd){var bc=bf.x-bd.x;var bh=bd.y-bf.y;var be=Math.atan2(bh,bc);var bg=Math.round(be*180/Math.PI);if(bg<0){bg=360-Math.abs(bg)}return bg}function aL(bd,bc){var be=aE(bd,bc);if((be<=45)&&(be>=0)){return p}else{if((be<=360)&&(be>=315)){return p}else{if((be>=135)&&(be<=225)){return o}else{if((be>45)&&(be<135)){return x}else{return e}}}}}function ar(){var bc=new Date();return bc.getTime()}function aY(bc){bc=f(bc);var be=bc.offset();var bd={left:be.left,right:be.left+bc.outerWidth(),top:be.top,bottom:be.top+bc.outerHeight()};return bd}function F(bc,bd){return(bc.x>bd.left&&bc.x<bd.right&&bc.y>bd.top&&bc.y<bd.bottom)}}}));!function(n){"use strict";n.fn.bsTouchSlider=function(i){var a=n(".carousel");return this.each(function(){function i(i){var a="webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend";i.each(function(){var i=n(this),t=i.data("animation");i.addClass(t).one(a,function(){i.removeClass(t)})})}var t=a.find(".item:first").find("[data-animation ^= 'animated']");a.carousel(),i(t),a.on("slide.bs.carousel",function(a){var t=n(a.relatedTarget).find("[data-animation ^= 'animated']");i(t)}),n(".carousel .carousel-inner").swipe({swipeLeft:function(n,i,a,t,e){this.parent().carousel("next")},swipeRight:function(){this.parent().carousel("prev")},threshold:0})})}}(jQuery);

$('#bootstrap-touch-slider').bsTouchSlider();