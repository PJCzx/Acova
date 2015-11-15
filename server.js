var express = require('express');
var schedule = require('node-schedule');


var acova = require('./lib/acova.js');
//var parking = require('./lib/parking.js');

var app = express();

var GPIO_POS = 15;
var GPIO_NEG = 16;
var GPIO_PARKING = 7;

var myHeatingSystem = new acova("Salon", GPIO_POS, GPIO_NEG);
//var myParkingSystem = new parking(GPIO_PARKING);

//TIME RULES
var weekMornings = new schedule.RecurrenceRule();
weekMornings.dayOfWeek = [1, 2, 3, 4, 5]; //MON, THU, WEN, TUR, FRI
weekMornings.hour = 6;
weekMornings.minute = 30;
weekMornings.duration = 1000*60*60*2; //2h
weekMornings.callback = function() {myHeatingSystem.setEco();};

var weekEvenings = new schedule.RecurrenceRule();
weekEvenings.dayOfWeek = [1, 2, 3, 4, 5]; //MON, THU, WEN, TUR, FRI
weekEvenings.hour = 18;
weekEvenings.minute = 30;
weekEvenings.duration = 1000*60*60*4; //4h
weekEvenings.callback = function() {myHeatingSystem.setConfortMinusTwo();};

var weekendMornings = new schedule.RecurrenceRule();
weekendMornings.dayOfWeek = [6, 7]; //SAT, SUN
weekendMornings.hour = 8;
weekendMornings.minute = 30;
weekendMornings.duration = 1000*60*60*3; //3h
weekendMornings.callback = function() {myHeatingSystem.setEco();};

var weekendEvenings = new schedule.RecurrenceRule();
weekendEvenings.dayOfWeek = [6, 7]; //SAT, SUN
weekendEvenings.hour = 17;
weekendEvenings.minute = 30;
weekendEvenings.duration = 1000*60*60*6; //6h
weekendEvenings.callback = function() {myHeatingSystem.setConfortMinusTwo();};

//TIME ACTIONS
var wm = schedule.scheduleJob(weekMornings, function() {
    console.log(Date(), 'This is a Week Morning event');
    myHeatingSystem.setConfort();
    if(weekMornings.duration !== undefined) setTimeout(weekMornings.callback, weekMornings.duration);
});
//wm.cancel();

var we = schedule.scheduleJob(weekEvenings, function() {
    console.log(Date(), 'This is a Week Evening event');
    myHeatingSystem.setConfort();
    if(weekMornings.weekEvenings !== undefined) setTimeout(weekEvenings.callback, weekEvenings.duration);
});
//we.cancel();

var wem = schedule.scheduleJob(weekendMornings, function() {
    console.log(Date(), 'This is a Week-End Morning event');
    myHeatingSystem.setConfort();
    if(weekendMornings.weekEvenings !== undefined) setTimeout(weekendMornings.callback, weekendMornings.duration);
});
//wem.cancel();

var wee = schedule.scheduleJob(weekendEvenings, function() {
    console.log(Date(), 'This is a Week-End Evening event');
    myHeatingSystem.setConfort();
    if(weekendEvenings.weekEvenings !== undefined) setTimeout(weekendEvenings.callback, weekendEvenings.duration);
});
//wee.cancel();


var response = function () {
  return '<ul><li><a href="/comfort">Confort</a></li><li><a href="/comfort-minus-one">-1</a></li><li><a href="/comfort-minus-two">-2</a></li><li><a href="/eco">Eco</a></li><li><a href="/no-frost">No Frost</a></li><li><a href="/off">Off</a></li><li><a href="/parking">Parking</a></li></ul><br><strong>Current: ' + myHeatingSystem.getCurrentStateToString() + ' (' + myHeatingSystem.getCurrentState() + ')</strong>';
};

//ROUTING
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
})
.get('/off', function (req, res) {
  myHeatingSystem.setOff();
  res.send(response());
});

app.get('/parking', function (req, res) {
  //myParkingSystem.open();
  res.send(response());
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});

