#!/usr/bin/env /usr/local/bin/node

var http = require('http');

var url = 'http://.../';

http.get(url + "status", function(res) {
  res.on('data', function (chunk) {
  	var json = JSON.parse(chunk);
    console.log(json.state);
    console.log("---");
    console.log(json.temperature + "°C");
    console.log(json.humidity + "%");
    console.log("Comfort | href=" + url + "comfort");
    console.log("Comfort -1°C | href=" + url + "comfort-minus-one");
    console.log("Comfort -2°C | href=" + url + "comfort-minus-two");
    console.log("Eco | href=" + url + "eco");
    console.log("No frost | href=" + url + "no-frost");
    console.log("Off | href=" + url + "off");

  });
}).on('error', function(e) {
  console.log(`Got error: ${e.message}`);
});