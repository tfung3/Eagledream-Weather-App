//Navbar Date and Time
let dt = new Date();
document.getElementById("date").innerHTML = dt.getMonth() +"."+ dt.getDate() +"."+ dt.getFullYear();

function formatAMPM(date) {
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0'+minutes : minutes;
	var strTime = hours + ':' + minutes + ' ' + ampm;
	document.getElementById("time").innerHTML = strTime;
}

formatAMPM(dt);

//Geolocation
var x = document.getElementById("userLocation");
var perm_tried = false;
var geocoder;
var lat;
var lng;

//Determine which city
var hk = document.getElementById("hk");
var paris = document.getElementById("paris");
var cairo = document.getElementById("cairo");
var nyc = document.getElementById("nyc");
var ba = document.getElementById("ba");


function bind_city_buttons() {
	var x = document.querySelectorAll(".city-weather");
	for(var i=0;i<x.length;i++){
		x[i].onclick = function(elem){
			var x = elem.target;
			call_info(x.getAttribute("data-lat"),
			x.getAttribute("data-long"),
			x.innerText.trim());};
	}
}
bind_city_buttons();
function loader(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
}

//Get the user's latitude and the longitude;
function successFunction(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;
		var n =codeLatLng(lat, lng);
	 	console.clear();
	// getWhichCity();
	// endpoint = window.location.href + "/api/get_forecast.php?lat="+lat+"&long="+lng;
	// send_xhr(endpoint);
}

function errorFunction(){
	if(perm_tried){
		alert("User declined Permission.");
	}else{
			alert("Permission required for weather information.");
		perm_tried = true;
			loader();
	}

	console.clear();
	// getWhichCity();
	// endpoint = window.location.href + "/api/get_forecast.php?lat="+lat+"&long="+lng;
	// send_xhr(endpoint);
	show_default_info()
}

function show_default_info(){
	lat = 40.7128;
	lng = 74.006;
	var n = "New York City";
	call_info(lat, lng, n);
}

function codeLatLng(lat, lng) {
	geocoder = new google.maps.Geocoder();
	var latlng = new google.maps.LatLng(lat, lng);
	geocoder.geocode({'location': latlng}, function(results, status) {
			if (status === "OK") {
	 		console.log(results);
				if (results.length>0) {
			 		//formatted address
			 		console.warn(results[0].formatted_address);

				var city, state;
				results[0].address_components.forEach( function(c){
					if(c.types!==undefined){
						if( c.types.indexOf("locality") > -1){city = c || city;}
						if( c.types.indexOf("administrative_area_level_1") > -1){state = c || state;}
					}
				});
					
					//city data
					x.innerHTML = city.short_name + " , " + state.short_name;
				call_info(lat, lng, city.short_name);
				} else {
						alert("No results found");
						show_default_info();
				}
			} else {
				alert("Geocoder failed due to: " + status);
				show_default_info();
			}
	});
}

function call_info(lat, long, name = ""){
	if(name.trim()==""){name = "("+lat+","+long+")";}
	var domain = window.location.href;
	var domain = "https://chiucs1234.ddns.net:8888/jade_weather_2";
	endpoint = domain + "/api/get_forecast.php?lat="+lat+"&long="+long;
	send_xhr(endpoint, show_info, {'name':name});
}

function c2f(d){return int(d*9/5+32);}
function f2c(d){return int((d-32)*5/9);}

// 	if(hk.onclick) {
// 		lat = 22.3193;
// 		lng = 114.1694;
// 	}else if (paris.onclick) {
// 		lat = 48.8566;
// 		lng = 2.3522;
// 	}else if (cairo.onclick) {
// 		lat = 30.0444;
// 		lng = 31.2357;
// 	}else if (nyc.onclick) {
// 		lat = 40.7128;
// 		lng = 74.006;
// 	}else if (ba.onclick) {
// 		lat = 34.6037;
// 		lng = 58.3816;
// 	}else if (plus.onclick){
// 		window.prompt;
// 	}

// 	return lat;
// 	return lng;

// }


//AJAX function
function send_xhr(endpoint, callback_function = function(){console.log(this);}, params = {}){
		var xhr = new XMLHttpRequest();
		xhr.responseType = 'json';
		xhr.onreadystatechange = function(){
				if(xhr.readyState === XMLHttpRequest.DONE){
			var r = this.response;
						callback_function(r, params);
				}
	}
	xhr.open("GET", endpoint, true);
	xhr.send(null);
}

function get_icon(icon_txt = ""){
	var definition = {
		"clear-day":"icons8-sun-50.png",
		"clear-night":"icons8-sun-50.png",
		"rain":"icons8-light-rain-512.png",
		"snow":"icons-8-snow-50.png",
		"sleet":"icons8-sleet-50.png",
		"wind":"icons8-windy-weather-512.png",
		"fog":"icons8-cloud-512.png",
		"cloudy":"icons8-cloud-512.png",
		"partly-cloudy-day":"icons8-cloud-512.png",
		"partly-cloudy-night":"icons8-cloud-512.png",
	}
	return definition[icon_txt.trim().toLowerCase()] || "icons8-cloud-512.png";
}

function int(n){
	return Number(n).toFixed(0);
}

//Json selection
function show_info(response, params = {}) {
	if(typeof response == "string"){
		response = JSON.parse(response);
	}
	var result = response;
	if(params["name"] == undefined){
		params["name"] = "?";
	}

	console.log(result);

	//define elements to be updated with data.
	var elem_low_temp	= document.getElementById("lowNum");
	var elem_curr_temp	= document.getElementById("centerTemp");
	var elem_high_temp	= document.getElementById("highNum");
	var elem_weather_img= document.getElementById("weatherIcon");
	var elem_weather	= document.getElementById("iconDescription");
	var elem_city_name	= document.getElementById("selectedCity");
	var elem_act_kite	= document.getElementById("kiteFlying");
	var elem_act_jogg	= document.getElementById("jogging");
	var elem_act_jogh	= document.getElementById("jog_high_temp");
	var elem_act_skii	= document.getElementById("skiing");

	var default_unknown = "?";
	//center circle
	if(result["daily"] == undefined){return;}
	if(result["daily"]["data"] == undefined){return;}
	if(result["daily"]["data"].length>0){
		var current_payload = result["daily"]["data"].slice(-1)[0]; //get last
		elem_low_temp.innerHTML = int(current_payload["temperatureMin"]) || default_unknown;
		var high_temp = int(current_payload["temperatureMax"]) || default_unknown;
		elem_high_temp.innerHTML = elem_act_jogh.innerHTML = high_temp;
		elem_act_skii.innerHTML = 0;
		if(current_payload["precipType"]!=undefined){
			if(current_payload["precipType"].trim().toLowerCase() == "snow"){
				elem_act_skii.innerHTML = int(current_payload["precipAccumulation"] || 0) || default_unknown;
			}
		}
	}

	if(result["currently"] == undefined){return;}
	elem_weather_img.src = get_icon(result["currently"]["icon"]) || default_unknown;
	elem_weather.innerHTML = result["currently"]["icon"].replace(/^\w/, c => c.toUpperCase()) || default_unknown;
	elem_curr_temp.innerHTML = int(result["currently"]["temperature"]) || default_unknown;
	elem_act_kite.innerHTML = result["currently"]["windSpeed"] || default_unknown;
	elem_act_jogg.innerHTML = result["currently"]["precipProbability"]*100 + "%" || default_unknown;
	elem_act_jogh.innerHTML = high_temp || default_unknown;
	elem_city_name.innerHTML = params["name"].trim() || default_unknown;

	if(result["hourly"] == undefined){return;}
	if(result["hourly"]["data"] == undefined){return;}
	var hourly_data = result["hourly"]["data"].slice(0, 7);

	var forecast_icons = document.querySelectorAll(".bottomTable .imgRow img");
	var forecast_temps = document.querySelectorAll(".bottomTable .tempRow div[id$='emp']");
	var forecast_hours = document.querySelectorAll(".bottomTable .timeRow div[id$='ime']");
	
	if( forecast_icons.length!=7 ||
		forecast_temps.length!=7 ||
		forecast_hours.length!=7){
		console.warn("HTML is messed up.");
	}

	if(hourly_data.length>0) {
		for(var i=0;i<hourly_data.length;i++){
			var e = hourly_data[i];
			var hour = unix2hr(e["time"]);
			hour = (hour>11?(hour - 12 == 0?12:hour - 12) + " PM":hour + " AM");
			var icon = get_icon(e["icon"]);
			var temp = e["temperature"];
			// lol
			forecast_icons[i].src		= icon;
			forecast_temps[i].innerText	= int(temp);
			forecast_hours[i].innerText	= hour;
		};
	}
}

//unix timestamp to time
function unix2hr(d){
	return new Date(d * 1000).getHours();
}

var current_format = "c";
function change_all(f="c"){
	var f = f.trim().charAt(0).toLowerCase();
	if(f!="c"&&f!="f"){f=current_format="c";}
	var elems = document.querySelectorAll("#jog_high_temp, #circleDiv #centerTemp, #circleDiv div[id$='um'], .bottomTable .tempRow div[id$='emp']");
	if(f=="c" && f!=current_format){
		elems.forEach(function(e){e.innerText = f2c(e.innerText);});
	}
	if(f=="f" && f!=current_format){
		elems.forEach(function(e){e.innerText = c2f(e.innerText);});
	}
	var x = document.querySelectorAll("#unitSwitch span[type]");
	for(var i=0;i<x.length;i++){
		x[i].className = "";
	}
	var x =document.querySelectorAll("#unitSwitch span[type='" + f + "']");
	for(var i=0;i<x.length;i++){
		x[i].className = "active";
	}
	return current_format=f;
}

function search(){
	var place = prompt("Please enter the desired location that we never would actually go.", "Heaven");
	if (place != null) {
		geocoder = new google.maps.Geocoder();
		geocoder.geocode(
			{'address': place},
			function(results, status) {
				if (status == google.maps.GeocoderStatus.OK) {
					 lat = results[0].geometry.location.lat();
					 lng = results[0].geometry.location.lng();
					 codeLatLng(lat, lng);
				} else if(status=="ZERO_RESULTS"){
					alert("Location not found, please try again.");
				} else {
					alert("Geocode was not successful for the following reason: " + status);
				}
			}
		);
	}
}

change_all();