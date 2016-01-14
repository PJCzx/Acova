#!/usr/bin/env /usr/local/bin/node

var http = require('http');

var url = 'http://.../status';

http.get(url, function(res) {
  res.on('data', function (chunk) {
  	var json = JSON.parse(chunk);
    console.log(json.state);
    console.log(json.temperature + "°C");
    console.log(json.humidity + "%");  });
}).on('error', function(e) {
  console.log(`Got error: ${e.message}`);
});