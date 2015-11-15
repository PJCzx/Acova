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
var minutes = new schedule.RecurrenceRule();
minutes.second = 0;
minutes.duration = 1000*30; //30s

var hours = new schedule.RecurrenceRule();
hours.minute = 0;

var weekMornings = new schedule.RecurrenceRule();
weekMornings.dayOfWeek = [1, 2, 3, 4, 5];
weekMornings.hour = 6;
weekMornings.minute = 30;

var weekEvenings = new schedule.RecurrenceRule();
weekEvenings.dayOfWeek = [1, 2, 3, 4, 5];
weekEvenings.hour = 18;
weekEvenings.minute = 30;

var weekendMornings = new schedule.RecurrenceRule();
weekendMornings.dayOfWeek = [6, 7];
weekendMornings.hour = 8;
weekendMornings.minute = 30;

var weekendEvenings = new schedule.RecurrenceRule();
weekendEvenings.dayOfWeek = [6, 7];
weekendEvenings.hour = 17;
weekendEvenings.minute = 30;

//TIME ACTIONS
var testMinutes = schedule.scheduleJob(minutes, function(){
    console.log(Date(), 'Minute');
    if(minutes.duration !== undefined)
    setTimeout(function() {
          console.log("Minute event is over");
    } ,minutes.duration);
});
//testMinutes.cancel();

var testHours = schedule.scheduleJob(hours, function(){
    console.log(Date(), 'Hours');
});
//testHours.cancel();

var wm = schedule.scheduleJob(weekMornings, function(){
    console.log(Date(), 'This is a Week Morning event');
});
//wm.cancel();

var we = schedule.scheduleJob(weekEvenings, function(){
    console.log(Date(), 'This is a Week Evening event');
});
//we.cancel();

var wem = schedule.scheduleJob(weekendMornings, function(){
    console.log(Date(), 'This is a Week-End Morning event');
});
//wem.cancel();

var wee = schedule.scheduleJob(weekendEvenings, function(){
    console.log(Date(), 'This is a Week-End Evening event');
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

