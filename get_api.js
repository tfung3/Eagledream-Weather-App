// AJAX function
function send_xhr(url = window.location.href,callback_function = function(){console.log(this);}){
	var 
    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.onreadystatechange = function(){
        if(xhr.readyState === XHLHttpRequest.DONE){
			var r = this.response;
            console.log(r);
        }
    }
    xhr.open("GET", url, true);
    xhr.send();
}

clear();
url = window.location.href + "api/get_forecast.php?lat=-48.56&long=12.86";
send_xhr(url);