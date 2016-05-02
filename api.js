//REQUIRED LIBS
var os = require('os');
var express = require('express');
var acova = require('./lib/acova.js');
var sensor = require('./lib/temperaturehumidity.js');
//var parking = require('./lib/parking.js');

var IS_RASPBERRY = os.arch() == "arm";
var DEBUG = true;

//LIBS USES
var app = express();
var mySensor = new sensor(22, 4, IS_RASPBERRY, DEBUG);
if (mySensor.init()) {
    console.log("Sensor initialize ok, reading:");
    console.log( mySensor.read());
} else {
    console.warn('Failed to initialize sensor');
}
//var myParkingSystem = new parking(7, IS_RASPBERRY, DEBUG);
var myHeatingSystem = new acova("Salon", 15, 16, IS_RASPBERRY, DEBUG).init();

//DEFINING A HOME
app.use(express.static('public'));
app.use('/', express.static('public'));

//ROUTING
app.get('/status', function (req, res) {
  var sensordata = mySensor.read();
  var resp = {
    state: myHeatingSystem.getCurrentStateToString(),
    stateCode: myHeatingSystem.getCurrentState(),
    temperature: sensordata.temperature,
    humidity: sensordata.humidity
  };
  res.send(resp);
})
.get('/targettemperature', function (req, res, targettemperature) {
  var resp = {targetTemperature: 99}
  res.send(resp);
})
.get('/targettemperature/:targettemperature', function (req, res, targettemperature) {
  console.log('Will set temp to:', req.params.targettemperature);
  res.sendStatus(200);
})
.get('/acovastatus', function (req, res) {
  var resp = {
    state: myHeatingSystem.getCurrentStateToString(),
    stateCode: myHeatingSystem.getCurrentState(),
  };
  res.send(resp);
})
.get('/mysensor', function (req, res) {
  res.send(mySensor.read());
})
.get('/log', function (req, res) {
  var resp = myHeatingSystem.logfile;
  res.send(resp);
})
.get('/comfort', function (req, res) {
  myHeatingSystem.setConfort();
  res.sendStatus(200);
})
.get('/comfort-minus-one', function (req, res) {
  myHeatingSystem.setConfortMinusOne();
  res.sendStatus(200);
})
.get('/comfort-minus-two', function (req, res) {
  myHeatingSystem.setConfortMinusTwo();
  res.sendStatus(200);
})
.get('/eco', function (req, res) {
  myHeatingSystem.setEco();
  res.sendStatus(200);
})
.get('/no-frost', function (req, res) {
  myHeatingSystem.setNoFrost();
  res.sendStatus(200);
})
.get('/off', function (req, res) {
  myHeatingSystem.setOff();
  res.sendStatus(200);
})
.get('/parking', function (req, res) {
  //myParkingSystem.open();
  res.sendStatus(200);
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  myHeatingSystem.log('Global : app listening at', host, port);
});

