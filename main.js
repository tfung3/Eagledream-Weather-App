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

function loader(){
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
	} 
}

//Get the user's latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    codeLatLng(lat, lng);
}

function errorFunction(){
	if(perm_tried){
		alert("User declined Permission.");
	}else{
	    alert("Permission required for weather information.");
		perm_tried = true;
	    loader();
	}
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
    		} else {
      			alert("No results found");
    		}
  		} else {
    		alert("Geocoder failed due to: " + status);
  		}
	});
}

loader();