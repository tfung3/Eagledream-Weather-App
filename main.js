//Navbar Date and Time
let dt = new Date();
document.getElementById("dateTime").innerHTML = ((("0"+(dt.getMonth()+1)).slice(-2)) +"."+ ("0"+dt.getDate()).slice(-2)) +"."+ (dt.getFullYear()) +" "+ (("0"+dt.getHours()).slice(-2)) +":"+ (("0"+dt.getMinutes()).slice(-2));
