var express = require('express');
var schedule = require('node-schedule');

var sys=require("sys");
var exec=require("child_process").exec;

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
var data = {};

data.temperatures = [];
data.humidities = [];
var Stdout;
var addTempAndHumid = function() {
    var child = exec("\/home/pi/Adafruit_Python_DHT/examples/AdafruitDHT.py 2302 4", function(error, stdout, stderr) {
        Stdout=stdout;
        var temperatureItem = {
            date: new Date(),
            value: stdout
        };
        data.temperatures.push(temperatureItem);   
        
        console.log("added", Stdout, "to temperatures");
        
        var humidityItem = {
            date: new Date(),
            value: stdout
        }; 
        data.humidities.push(humidityItem);
    });
};

addTempAndHumid();
setInterval(addTempAndHumid(), 1000*60*10);

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
      myHeatingSystem.log('This is a Week Morning event');
      myHeatingSystem.setConfort();
      if(rules.weekMornings.duration !== undefined) setTimeout(rules.weekMornings.callback, rules.weekMornings.duration);
  });
 
  scheduledJobs.we = schedule.scheduleJob(rules.weekEvenings, function() {
      myHeatingSystem.log('This is a Week Evening event');
      myHeatingSystem.setConfort();
      if(rules.weekEvenings.duration !== undefined) setTimeout(rules.weekEvenings.callback, rules.weekEvenings.duration);
  });
 
  scheduledJobs.wem = schedule.scheduleJob(rules.weekendMornings, function() {
      myHeatingSystem.log('This is a Week-End Morning event');
      myHeatingSystem.setConfort();
      if(rules.weekendMornings.duration !== undefined) setTimeout(rules.weekendMornings.callback, rules.weekendMornings.duration);
  });
 
  scheduledJobs.wee = schedule.scheduleJob(rules.weekendEvenings, function() {
      myHeatingSystem.log('This is a Week-End Evening event');
      myHeatingSystem.setConfort();
      if(rules.weekendEvenings.duration !== undefined) setTimeout(rules.weekendEvenings.callback, rules.weekendEvenings.duration);
  });
  myHeatingSystem.log("Global : Jobs SCHEDULED");  
};
scheduleJobs();

var cancelScheduledJobs = function () {
  scheduledJobs.wm.cancel();
  scheduledJobs.we.cancel();
  scheduledJobs.wem.cancel();
  scheduledJobs.wee.cancel();
  myHeatingSystem.log("Global Jobs CANCELED");
};

//Static files
app.use(express.static('public'));
app.use('/', express.static('public'));

//ROUTING
app.get('/status', function (req, res) {
  var resp = {
    text: myHeatingSystem.getCurrentStateToString(),
    value: myHeatingSystem.getCurrentState()
  };
  res.send(resp);
})
.get('/temperature', function (req, res) {
  var resp = {
      last: Stdout,
      other: data.temperatures[data.temperatures.length];
  };
  res.send(resp);
})
.get('/log', function (req, res) {
  var resp = myHeatingSystem.logfile;
  res.send(resp);
})
.get('/comfort', function (req, res) {
  myHeatingSystem.setConfort();
  res.redirect('/');
})
.get('/comfort-minus-one', function (req, res) {
  myHeatingSystem.setConfortMinusOne();
  res.redirect('/');
})
.get('/comfort-minus-two', function (req, res) {
  myHeatingSystem.setConfortMinusTwo();
  res.redirect('/');
})
.get('/eco', function (req, res) {
  myHeatingSystem.setEco();
  res.redirect('/');
})
.get('/no-frost', function (req, res) {
  myHeatingSystem.setNoFrost();
  res.redirect('/');
})
.get('/off', function (req, res) {
  myHeatingSystem.setOff();
  res.redirect('/');
})
.get('/cancel', function (req, res) {
  cancelScheduledJobs();
  res.redirect('/');
})
.get('/schedule', function (req, res) {
  scheduleJobs();
  res.redirect('/');
})
.get('/temperatures', function (req, res) {
  res.send(data.temperatures);
})
.get('/humidities', function (req, res) {
  res.send(data.humidities);
});

app.get('/parking', function (req, res) {
  //myParkingSystem.open();
  res.redirect('/');
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  myHeatingSystem.log('Global : app listening at', host, port);
});

