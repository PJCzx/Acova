#!/usr/bin/env /usr/local/bin/node

var http = require('http');

var url = 'http://home.pierrejuliencazaux.com:3001/';

http.get(url + "status", function(res) {
  res.on('data', function (chunk) {
    var json = JSON.parse(chunk);
    console.log(json.targetState);
    console.log("---");
    console.log(json.temperature + "°C (" + json.targetTemperature + "°C)");
    console.log("Status: " + json.currentHeatingCoolingState + " (0:OFF 1:HEAT 2:COOL)");
    console.log(json.humidity + "%");
    console.log("Auto (" + json.targetTemperature + "°C)" +"| href=" + url + "auto");
    console.log("Target | href=" + url + "targetTemperature/");
    console.log("Comfort | href=" + url + "comfort");
    console.log("Comfort -1°C | href=" + url + "comfort-minus-one");
    console.log("Comfort -2°C | href=" + url + "comfort-minus-two");
    console.log("Eco | href=" + url + "eco");
    console.log("No frost | href=" + url + "no-frost");
    console.log("Off | href=" + url + "off");

  });
}).on('error', function(e) {
  //console.log(`Got error: ${e.message}`);
  console.log(`-`);
});