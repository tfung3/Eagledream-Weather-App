<?php
include_once(dirname(__FILE__)."/vendor/autoload.php");
header("Content-type: text/json; charset=utf-8");

if(!(isset($_GET["lat"]) && isset($_GET["long"]))){exit();}
// if(!(is_double(trim($_GET["lat"])) && is_double(trim($_GET["long"])))){exit();}

$latitude	= $_GET["lat"];
$longtitude	= $_GET["long"];
$secret_key = "ce1c597a93fb26dfba1b1f2ff1e70ae0";

$latitude = number_format($latitude,6,".","");
$longtitude = number_format($longtitude,6,".","");
$store_dir = dirname(__FILE__)."/cache/";
$store_file = Date("YmdH_").$latitude."_".$longtitude.".json";
if(!is_dir($store_dir)){mkdir($store_dir, 0777, true);}

if(!file_exists($store_dir.$store_file)){
	$url = "https://api.darksky.net/forecast/".trim($secret_key)."/".$latitude.",".$longtitude;
	$ch = curl_init(); 
	curl_setopt($ch, CURLOPT_URL,$url);
	curl_setopt($ch, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36'); 
	curl_setopt($ch, CURLOPT_HEADER, 0); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0); 
	curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0); 
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
	$output = curl_exec($ch);
	
	file_put_contents($store_dir.$store_file, $output);
}
$result = json_decode(file_get_contents($store_dir.$store_file), true);
print_r(json_encode($result, JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
?>