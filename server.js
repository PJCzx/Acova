var express = require('express');
var schedule = require('node-schedule');
var fs = require('fs');

var sys=require("sys");
var exec=require("child_process").exec;

var sensorLib = require('node-dht-sensor');

var data = {};

data.temperatures = [];
data.humidities = [];

var sensorData = [];

fs.readFile('tmp/sensordata','utf8', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    sensorData = JSON.parse(data);
    console.log("sensorData loaded", sensorData);
  }
});


var sensor = {
    initialize: function () {
        return sensorLib.initialize(22, 4);
    },
    read: function () {
        var readout = sensorLib.read();
        //console.log('Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +'humidity: ' + readout.humidity.toFixed(2) + '%');
        
        var temperatureItem = {
            date: new Date(),
            value: readout.temperature.toFixed(2)
        };
        data.temperatures.push(temperatureItem);   
                
        var humidityItem = {
            date: new Date(),
            value: readout.humidity.toFixed(2)
        }; 
        data.humidities.push(humidityItem);
        
        var dataItem = {
            date: new Date(),
            temperature: readout.temperature.toFixed(2),
            humidity: readout.humidity.toFixed(2)
        }; 
        sensorData.push(dataItem);

        fs.writeFile("tmp/sensordata", JSON.stringify(sensorData), function(err) {
          if(err) {
              return console.log(err);
          } else {
            console.log("Sensor Data file was saved!");
          }
        }); 
        
        setTimeout(function () {
            sensor.read();
        }, 1000);//*60*10
    }
};

if (sensor.initialize()) {
    sensor.read();
} else {
    console.warn('Failed to initialize sensor');
}

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
    state: myHeatingSystem.getCurrentStateToString(),
    stateCode: myHeatingSystem.getCurrentState(),
    temperature: data.temperatures && data.temperatures.length > 0 ? data.temperatures[data.temperatures.length - 1].value : 0,
    humidity: data.temperatures && data.temperatures.length > 0 ? data.humidities[data.humidities.length - 1].value : 0
  };
  res.send(resp);
})
.get('/temperature', function (req, res) {
  var resp = data.temperatures[data.temperatures.length - 1];
  res.send(resp);
})
.get('/humidity', function (req, res) {
  var resp = data.humidities[data.humidities.length - 1];
  res.send(resp);
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
.get('/cancel', function (req, res) {
  cancelScheduledJobs();
  res.sendStatus(200);
})
.get('/schedule', function (req, res) {
  scheduleJobs();
  res.sendStatus(200);
})
.get('/temperatures', function (req, res) {
  res.send(data.temperatures);
})
.get('/humidities', function (req, res) {
  res.send(data.humidities);
})
.get('/sensordata', function (req, res) {
  res.send(sensorData);
});

app.get('/parking', function (req, res) {
  //myParkingSystem.open();
  res.sendStatus(200);
});

var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  myHeatingSystem.log('Global : app listening at', host, port);
});

