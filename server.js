var express = require('express');

var acova = require('./lib/acova.js');
var parking = require('./lib/parking.js');

var app = express();

var GPIO_POS = 15;
var GPIO_NEG = 16;
var GPIO_PARKING = 7;

var myHeatingSystem = new acova(GPIO_POS, GPIO_NEG);
var myParkingSystem = new parking(GPIO_PARKING);

var response = function () {
  return '<ul><li><a href="/comfort">Confort</a></li><li><a href="/comfort-minus-one">-1</a></li><li><a href="/comfort-minus-two">-2</a></li><li><a href="/eco">Eco</a></li><li><a href="/no-frost">No Frost</a></li><li><a href="/parking">Parking</a></li></ul><br><strong>Current: ' + myHeatingSystem.getCurrentStateToString() + '(' + myHeatingSystem.getCurrentState() + ')</strong>';
};

app.get('/', function (req, res) {
  res.send(response());
})
.get('/comfort', function (req, res) {
  myHeatingSystem.setConfort();
  res.send(response());
})
.get('/comfort-minus-one', function (req, res) {
  myHeatingSystem.setConfortMinusOne();
  res.send(response());
})
.get('/comfort-minus-two', function (req, res) {
  myHeatingSystem.setConfortMinusTwo();
  res.send(response());
})
.get('/eco', function (req, res) {
  myHeatingSystem.setEco();
  res.send(response());
})
.get('/no-frost', function (req, res) {
  myHeatingSystem.setNoFrost();
  res.send(response());
});

app.get('/parking', function (req, res) {
  myParkingSystem.open();
  res.send(response());
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

