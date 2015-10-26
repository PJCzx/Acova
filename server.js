var gpio = require('rpi-gpio');
var express = require('express');
var acova = require('./lib/acova.js');
var app = express();


var GPIO_POS = 15;
var GPIO_NEG = 16;

var myHeatingSystem = new acova(GPIO_POS, GPIO_NEG);

gpio.setup(7, gpio.DIR_OUT);
gpio.setup(GPIO_POS, gpio.DIR_OUT);
gpio.setup(GPIO_NEG, gpio.DIR_OUT);

setPositiveAlternance = function (value) {
    gpio.write(GPIO_POS, value, function(err) {
        if (err) throw err;
        else {
          console.log('GPIO_POS is now', value);
        }
    });
}

setNegativeAlternance = function (value) {
    gpio.write(GPIO_NEG, value, function(err) {
        if (err) throw err;
        else {
          console.log('GPIO_NEG is now', value);
        }
    });
}

gpioApply = function  () {
  console.log(Date());
  setPositiveAlternance(this.gpioPosState);
  setNegativeAlternance(this.gpioNegState);
};


app.get('/', function (req, res) {
  res.send('<ul><li><a href="/comfort">Confort</a></li><li><a href="/comfort-minus-one">-1</a></li><li><a href="/comfort-minus-two">-2</a></li><li><a href="/eco">Eco</a></li><li><a href="/no-frost">No Frost</a></li><li><a href="/parking">Parking</a></li></ul><br><strong>Current: ' + myHeatingSystem.getCurrentState() + '</strong>');})
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

