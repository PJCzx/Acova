var gpio = require('rpi-gpio');
var express = require('express');
var acova = require('./lib/acova.js');
var app = express();

var myHeatingSystem = new acova();

gpio.setup(7, gpio.DIR_OUT);

app.get('/', function (req, res) {
  res.send('<ul><li><a href="/comfort">Confort</a></li><li><a href="/comfort-minus-one">-1</a></li><li><a href="/comfort-minus-two">-2</a></li><li><a href="/eco">Eco</a></li><li><a href="/no-frost">No Frost</a></li><li><a href="/parking">Parking</a></li></ul>');
})
.get('/comfort', function (req, res) {
  res.send('Confort');
  myHeatingSystem.setConfort();
})
.get('/comfort-minus-one', function (req, res) {
  res.send('Minus one');
  myHeatingSystem.setConfortMinusOne();
})
.get('/comfort-minus-two', function (req, res) {
  myHeatingSystem.setConfortMinusTwo();
  res.send('Minus two');
})
.get('/eco', function (req, res) {
  myHeatingSystem.setEco();
  res.send('Eco');
})
.get('/no-frost', function (req, res) {
  myHeatingSystem.setNoFrost();
  res.send('No frost');
})

.get('/parking', function (req, res) {
  res.send('Open the gate I said bitch! :)');

  console.log('The garage dor has been open at', Date());

  gpio.write(7, true, function() {
  console.log("Pin 7 HIGH");  
  setTimeout(function() {
    gpio.write(false);
          console.log("Pin 7 LOW");
  } , 1000);
  });
});;

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

