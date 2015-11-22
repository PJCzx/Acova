var express = require('express');
var schedule = require('node-schedule');


var acova = require('./lib/acova.js');
var parking = require('./lib/parking.js');

var app = express();

var GPIO_POS = 15;
var GPIO_NEG = 16;
var GPIO_PARKING = 7;

var myHeatingSystem = new acova("Salon", GPIO_POS, GPIO_NEG).init();
var myParkingSystem = new parking(GPIO_PARKING, false);

var rules = {};
var scheduledJobs = {};

//TIME RULES
rules.weekMornings = new schedule.RecurrenceRule();
rules.weekMornings.dayOfWeek = [1, 2, 3, 4, 5]; //MON, THU, WEN, TUR, FRI
rules.weekMornings.hour = 6;
rules.weekMornings.minute = 00;
rules.weekMornings.duration = 1000*60*60*2; //2h
rules.weekMornings.callback = function() { myHeatingSystem.setEco(); };

rules.weekEvenings = new schedule.RecurrenceRule();
rules.weekEvenings.dayOfWeek = [1, 2, 3, 4, 5]; //MON, THU, WEN, TUR, FRI
rules.weekEvenings.hour = 18;
rules.weekEvenings.minute = 30;
rules.weekEvenings.duration = 1000*60*60*3; //3h
rules.weekEvenings.callback = function() { myHeatingSystem.setConfortMinusTwo(); };

rules.weekendMornings = new schedule.RecurrenceRule();
rules.weekendMornings.dayOfWeek = [0, 6]; //SUN, SAT
rules.weekendMornings.hour = 8;
rules.weekendMornings.minute = 30;
rules.weekendMornings.duration = 1000*60*60*3; //3h
rules.weekendMornings.callback = function() { myHeatingSystem.setEco(); };

rules.weekendEvenings = new schedule.RecurrenceRule();
rules.weekendEvenings.dayOfWeek = [0, 6]; //SUN, SAT
rules.weekendEvenings.hour = 17;
rules.weekendEvenings.minute = 30;
rules.weekendEvenings.duration = 1000*60*60*6; //6h
rules.weekendEvenings.callback = function() { myHeatingSystem.setConfortMinusTwo(); };

//TIME ACTIONS
var scheduleJobs = function() { 
  scheduledJobs.wm = schedule.scheduleJob(rules.weekMornings, function() {
      console.log(Date(), 'This is a Week Morning event');
      myHeatingSystem.setConfort();
      if(rules.weekMornings.duration !== undefined) setTimeout(rules.weekMornings.callback, rules.weekMornings.duration);
  });
 
  scheduledJobs.we = schedule.scheduleJob(rules.weekEvenings, function() {
      console.log(Date(), 'This is a Week Evening event');
      myHeatingSystem.setConfort();
      if(rules.weekEvenings.duration !== undefined) setTimeout(rules.weekEvenings.callback, rules.weekEvenings.duration);
  });
 
  scheduledJobs.wem = schedule.scheduleJob(rules.weekendMornings, function() {
      console.log(Date(), 'This is a Week-End Morning event');
      myHeatingSystem.setConfort();
      if(rules.weekendMornings.duration !== undefined) setTimeout(rules.weekendMornings.callback, rules.weekendMornings.duration);
  });
 
  scheduledJobs.wee = schedule.scheduleJob(rules.weekendEvenings, function() {
      console.log(Date(), 'This is a Week-End Evening event');
      myHeatingSystem.setConfort();
      if(rules.weekendEvenings.duration !== undefined) setTimeout(rules.weekendEvenings.callback, rules.weekendEvenings.duration);
  });
  console.log("Jobs SCHEDULED");  
};
scheduleJobs();

var cancelScheduledJobs = function () {
  scheduledJobs.wm.cancel();
  scheduledJobs.we.cancel();
  scheduledJobs.wem.cancel();
  scheduledJobs.wee.cancel();
  console.log("Jobs CANCELED");
};

var response = function () {
  var resp = "";
  resp += '<li><a href="/cancel">Cancel Jobs</a></li>';
  resp += '<li><a href="/schedule">Schedule Jobs</a></li>';
  resp += '<li><a href="/comfort">Confort</a></li>';
  resp += '<li><a href="/comfort-minus-one">-1</a></li>';
  resp += '<li><a href="/comfort-minus-two">-2</a></li>';
  resp += '<li><a href="/eco">Eco</a></li>';
  resp += '<li><a href="/no-frost">No Frost</a></li>';
  resp += '<li><a href="/off">Off</a></li>';
  resp += '<li><a href="/parking">Parking</a></li>';
  resp += '<br>';
  resp += '<strong>Current: ' + myHeatingSystem.getCurrentStateToString() + ' (' + myHeatingSystem.getCurrentState() + ')</strong>';
  return resp;
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
})
.get('/cancel', function (req, res) {
  cancelScheduledJobs();
  res.send(response());
})
.get('/schedule', function (req, res) {
  scheduleJobs();
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

