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
        opacity: 0.8,
        weight: 2,
        color: getColor(feature.properties.NAME_1),
        fillOpacity: 0.5
    };
    }


    function selectFeature(e) { //function that selects each municipality
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


    function zoomToFeature(e) {  //zoom each feature (municipality)
    map.fitBounds(e.target.getBounds());
    }

    function onEachFeature(feature, layer) {

    layer.on({
        mouseover: selectFeature,
        click: zoomToFeature
        });

    var label = L.marker(layer.getBounds().getCenter(), {
      icon: L.divIcon({
        className: 'label',
        html: feature.properties.NAME_1 + ' (' + feature.properties.NL_NAME_1 + ')',
        iconSize: [40, 70]
      })
     }).addTo(map);


    layer.on('click', function(e) {
        var mun_name = feature.properties.NAME_1;
        $.getJSON("qatar_zone_population.geojson", function(data1) {
            if (mun_name == "Ar Rayyan")
               {var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap1, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){     // loading total population and median age details for the municipality
                    var array = get_array_from_json(data,4);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){    // loading female population details for this municipality
                    var array = get_array_from_json(data,4);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){     // loading male population details for this municipality
                    var array = get_array_from_json(data,4);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });

               }
            else if (mun_name == "Ad Dawhah")
               	{var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap2, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){
                    var array = get_array_from_json(data,1);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){
                    var array = get_array_from_json(data,1);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){
                    var array = get_array_from_json(data,1);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });
               }
            else if (mun_name == "Madinat ash Shamal")
               {var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap3,onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){   // loading total population and median age details for the municipality
                    var array = get_array_from_json(data,5);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){   // loading female population details for the municipality
                    var array = get_array_from_json(data,5);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){    // loading male population details for the municipality
                    var array = get_array_from_json(data,5);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });
               }
            else if (mun_name == "Al Wakrah")
               {var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap4, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){
                    var array = get_array_from_json(data,7);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){
                    var array = get_array_from_json(data,7);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){
                    var array = get_array_from_json(data,7);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });
               }
            else if (mun_name == "Al Khor")
               	{var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap5, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){
                    var array = get_array_from_json(data,2);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){
                    var array = get_array_from_json(data,2);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){
                    var array = get_array_from_json(data,2);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });
               }
            else if (mun_name == "Umm Salal")
               {var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap6, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div2").load("result_totalpopulation.json", function(data,status){            // loading total population and median age details for the municipality
                    var array = get_array_from_json(data,8);
                    var median_age_group = get_median_agegroup(array);
                    var text1 = "Total population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + array[17] + '<br><br>';
                    var text2 = "Median Age Group " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + median_age_group;
                    this.innerHTML = mun_name + '<br>';
                $("#div3").load("result_femalepopulation.json", function(data,status){         // loading female population details for the municipality
                    var array = get_array_from_json(data,8);

                    var text3 = "Total female population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17]  + '<br><br>';
                    this.innerHTML = text1 + text2;
                $("#div4").load("result_malepopulation.json", function(data,status){         // loading male population details for the municipality
                    var array = get_array_from_json(data,8);

                    this.innerHTML = text3 + "Total male population " + '<br>' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + array[17];
                });
                });
                });
               }
            else if (mun_name == "Al Daayen")
               {var zone = L.geoJson(data1,{style: myStyle_zone,filter: addDataToMap7, onEachFeature: onEachFeature1});
                zone.addTo(map);
                $("#div1").load("result_totalpopulation.json", function(data,status){
                    var array_1 = data.split("}");
                    var array_2 = array_1[0].toString().split(",");
                    var array_3 = array_2[0].toString().split("{");
                    var array_4 = array_3[2].toString().split(":");
                    var array_5 = [];
                    var array_5_names = [];
                    for(var i=17;i>0;i--)
                    {   var array_6 = array_2[i].toString().split(":");
                        array_5[17-i] = array_6[1];
                        array_5_names[17-i] = array_6[0];
                    }
                    array_5[17] = array_4[1];
                    array_5_names[17] = array_4[0];
                    var array_7 = sorted(array_5);

                    var text1 = "Total population: " + array_7[17] + '<br>' + "Median age group: " + '<br>';
                $("#div1").load("result_femalepopulation.json", function(data,status){
                    var array_1 = data.split("}");
                    var array_2 = array_1[0].toString().split(",");
                    var array_3 = array_2[0].toString().split("{");
                    var array_4 = array_3[2].toString().split(":");
                    var array_5 = [];
                    var array_5_names = [];
                    for(var i=17;i>0;i--)
                    {   var array_6 = array_2[i].toString().split(":");
                        array_5[17-i] = array_6[1];
                        array_5_names[17-i] = array_6[0];
                    }
                    array_5[17] = array_4[1];
                    array_5_names[17] = array_4[0];
                    var array_7 = sorted(array_5);

                    var text2 = "Total female population: " + array_7[17] + '<br>';
                $("#div1").load("result_malepopulation.json", function(data,status){
                    var array_1 = data.split("}");
                    var array_2 = array_1[0].toString().split(",");
                    var array_3 = array_2[0].toString().split("{");
                    var array_4 = array_3[2].toString().split(":");
                    var array_5 = [];
                    var array_5_names = [];
                    for(var i=17;i>0;i--)
                    {   var array_6 = array_2[i].toString().split(":");
                        array_5[17-i] = array_6[1];
                        array_5_names[17-i] = array_6[0];
                    }
                    array_5[17] = array_4[1];
                    array_5_names[17] = array_4[0];
                    var array_7 = sorted(array_5);

                    this.innerHTML = "Municipality: " + mun_name + '<br>' + text1 + text2 + "Total male population: " + array_7[17];
                });
                });
                });
               }
        });


          function get_median_agegroup(array_sorted)
                {   var b = array_sorted;
    	            var x = 0;
    	            for(var k=0;x<=(b[17]/2);k++)
    	            {
    	            	x = x + Number(b[k]);
    	            }
    	            return b[18+(k-1)];
                }


          function get_array_from_json(dataString,j) // from json, a sorted array is obtained from this function
                {
    	            var array_1 = dataString.split("}");
                    var array_2 = array_1[j].toString().split(",");
                    var array_3 = array_2[1].toString().split("{");
                    var array_4 = array_3[1].toString().split(":");
                    var array_5 = [];
                    var array_5_names = [];
                    for(var i=18;i>1;i--)                         //creating arr_5 which is an array having only the population data (values) and arr_5_names having keys of the corresponding values
                    {   var array_6 = array_2[i].toString().split(":");
                        array_5[18-i] = array_6[1];
                        array_5_names[18-i] = array_6[0];
                    }
                    array_5[17] = array_4[1];
                    array_5_names[17] = array_4[0];
                    var array_7 = sorted(array_5,array_5_names);

                    return array_7;
                }
          function sorted(array, array_names) //sorting the array, in order to get a final array: 0 to 17 has values and 18 to 35 has keys
          {     var i=0;                          //manually done since in the json file, the key-value pairs are not sorted
          	    var array_final = [];
          		    array_final[i]= array[17];
          	        array_final[i+1]= array[10];
          	        array_final[i+2]= array[11];
          	        array_final[i+3]= array[13];
          	        array_final[i+4]= array[4];
          	        array_final[i+5]= array[1];
          	        array_final[i+6]= array[14];
          	        array_final[i+7]= array[16];
          	        array_final[i+8]= array[15];
          	        array_final[i+9]= array[12];
          	        array_final[i+10]= array[0];
          	        array_final[i+11]= array[9];
          	        array_final[i+12]= array[7];
          	        array_final[i+13]= array[3];
          	        array_final[i+14]= array[5];
          	        array_final[i+15]= array[6];
          	        array_final[i+16]= array[8];
          	        array_final[i+17]= array[2];
          	        array_final[i+18]= array_names[17];
          	        array_final[i+19]= array_names[10];
          	        array_final[i+20]= array_names[11];
          	        array_final[i+21]= array_names[13];
          	        array_final[i+22]= array_names[4];
          	        array_final[i+23]= array_names[1];
          	        array_final[i+24]= array_names[14];
          	        array_final[i+25]= array_names[16];
          	        array_final[i+26]= array_names[15];
          	        array_final[i+27]= array_names[12];
          	        array_final[i+28]= array_names[0];
          	        array_final[i+29]= array_names[9];
          	        array_final[i+30]= array_names[7];
          	        array_final[i+31]= array_names[3];
          	        array_final[i+32]= array_names[5];
          	        array_final[i+33]= array_names[6];
          	        array_final[i+34]= array_names[8];
          	        array_final[i+35]= array_names[2];
          	    return array_final;
          }

        function onEachFeature1(feature,layer) //for zone geojson-to add zone details when municipality is clicked
        {
        	layer.on({
        mouseover: selectFeature,
        //click: zoomToFeature
        });
        	layer.on('click', function(e){
    		            	$("#divzone").load("result___popforzones.json", function(data,status){
    		            		var a1 = data.split("{");
    		            		var a2 = a1.toString().split("}");
    		            		var a3 = a2.toString().split(":");
    		            		var a4 = a3.toString().split(",");
    		            		for (var j=0;j<819;j=j+9)
    		            		{
    		            			var ZID = a4[j+4];
    		            		    if(feature.properties.ZONE_ID == ZID)
    		            		    {
    		            		    	var total = Number(a4[j+6]) + Number(a4[j+8]);
    		            			this.innerHTML = '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + a4[j+1] + '<br><br><br>' + "Male: " + a4[j+6] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + "Female: " + a4[j+8] + '&nbsp' + '&nbsp' + '&nbsp' + '&nbsp' + "Total: " + total;
    		            		    }

    		            		}
    		            	});
    		            });
        }
        function addDataToMap1(feature)  //filtering the municipality, Zone ID wise, for Ar Rayyan
             {
                return ((feature.properties.ZONE_ID>50 && feature.properties.ZONE_ID<57) ||feature.properties.ZONE_ID==81 || feature.properties.ZONE_ID==83 || feature.properties.ZONE_ID==96 || feature.properties.ZONE_ID==97)
             }
        function addDataToMap2(feature)  //filtering the municipality, Zone ID wise, for Doha
             {
                return ((feature.properties.ZONE_ID>0 && feature.properties.ZONE_ID<8) || (feature.properties.ZONE_ID>9 && feature.properties.ZONE_ID<51) || feature.properties.ZONE_ID==57 || feature.properties.ZONE_ID==58 || (feature.properties.ZONE_ID>59 && feature.properties.ZONE_ID<69))
             }
        function addDataToMap3(feature)   //filtering the municipality, Zone ID wise, for Shamal
             {
                return ((feature.properties.ZONE_ID>76 && feature.properties.ZONE_ID<80))
             }
        function addDataToMap4(feature)   //filtering the municipality, Zone ID wise, for Al Wakrah
             {
                return ((feature.properties.ZONE_ID>89 && feature.properties.ZONE_ID<92))
             }
        function addDataToMap5(feature) //filtering the municipality, Zone ID wise, for Al Khor
             {
                return ((feature.properties.ZONE_ID>73 && feature.properties.ZONE_ID<77))
             }
        function addDataToMap6(feature) //filtering the municipality, Zone ID wise, for Umm Salal
             {
                return (feature.properties.ZONE_ID==71)
             }
        function addDataToMap7(feature)  //filtering the municipality, Zone ID wise, for Al Daayen
             {
                return ((feature.properties.ZONE_ID>68 && feature.properties.ZONE_ID<71))
             }
        function myStyle_zone(feature) {
        return {
        color: "black",
        weight: 2
         };
        }                  
    });                 
    layer.on('mouseout', function(e) {                 //on mouseout, goes back to default style
            layer.setStyle({
                color: getColor(feature.properties.NAME_1),
                fillColor: getColor(feature.properties.NAME_1)
            });
        });
    //layer.bindLabel(feature.properties.NAME_1);
    //layer.addTo(map);
    }