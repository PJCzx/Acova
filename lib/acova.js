/* jshint node: true */
"use strict";
module.exports = function Acova (name, GPIO_POS, GPIO_NEG, raspberry, debug, sensor) {

	const COMFORT = 0;
	const COMFORT_MINUS_ONE = 1;
	const COMFORT_MINUS_TWO = 2;
	const ECO = 3;
	const NO_FROST = 4;
	const OFF = 5;
	const AUTO = 6;

	return {
		targetState: AUTO,
		name: name || "NO NAME",
		interval: null,
		RASPBERRY: raspberry === undefined ? true : raspberry,
		logfile: [],
		debug: debug === undefined ? false : debug,
		targetTemperature: 17.0,
		sensor: sensor,
		log: function() {
			var logline = "";
			var args = Array.prototype.slice.call(arguments, 0);
			logline = args.join(" ");

			var logitem = {
				date: Date(),
				name: name,
				//arguments: arguments,
				args: args,
				logline: logline
			};

			this.logfile.push(logitem);
			console.log(Date(), this.name, logline);
		},
		init: function () {
			if(this.RASPBERRY) {
				this.log("This is a RASPBERRY");
				this.rpigpio = require('rpi-gpio');
				this.rpigpio.setup(GPIO_POS, this.rpigpio.DIR_OUT);
				this.rpigpio.setup(GPIO_NEG, this.rpigpio.DIR_OUT);
				this.updateGPIO();
			} else {
				this.log("This is NOT A RASPBERRY");
			}
			return this;
		},
		updateGPIO: function () {
			switch (this.targetState) {
				case COMFORT:
					//NO SIGNAL
					if(this.interval !== null) clearInterval(this.interval);
					this.gpioPosState = false;
					this.gpioNegState = false;
					this.gpioApply();
				break;
				
				case COMFORT_MINUS_ONE:
					//3 SEC EVERY 5MIN
					if(this.interval !== null) clearInterval(this.interval);

					this.interval = setInterval(function () {
					 	//set 3 sec
						this.gpioPosState = true;
						this.gpioNegState = true;
						this.gpioApply();

					 	setTimeout(function(){
							this.gpioPosState = false;
							this.gpioNegState = false;
							this.gpioApply();
					 	}.bind(this), 3*1000);
					}.bind(this), 5*60*1000);
				break;
				
				case COMFORT_MINUS_TWO:
					//7 SEC EVERY 5 MIN
					if(this.interval !== null) clearInterval(this.interval);
					
					this.interval = setInterval(function () {
					 	//set 7 sec
						this.gpioPosState = true;
						this.gpioNegState = true;
						this.gpioApply();

					 	setTimeout(function(){
							this.gpioPosState = false;
							this.gpioNegState = false;
							this.gpioApply();
					 	}.bind(this), 7*1000);
					}.bind(this), 5*60*1000);
				break;
				
				case ECO:
					//FULL SIGNAL
					if(this.interval !== null) clearInterval(this.interval);
					this.gpioPosState = true;
					this.gpioNegState = true;
					this.gpioApply();
				break;
				
				case NO_FROST:
					//HALF NEGATIVE
					if(this.interval !== null) clearInterval(this.interval);
					this.gpioPosState = false;
					this.gpioNegState = true;
					this.gpioApply();
				break;
				
				case OFF:
					//HALF POSITIVE	
					if(this.interval !== null) clearInterval(this.interval);
					this.gpioPosState = true;
					this.gpioNegState = false;
					this.gpioApply();
				break;

				case AUTO:
					if(this.interval !== null) clearInterval(this.interval);
					
					var autoInterval = function() {
						var sensordata = this.sensor.read();
						var currentTemperature = parseFloat(sensordata.temperature);
						console.log("AUTO Adjust temp from/to", currentTemperature, this.targetTemperature);
						if(this.targetTemperature >= currentTemperature + 0.25) {
							//Heat
							this.gpioPosState = false;
							this.gpioNegState = false;
							this.gpioApply();
							console.log("Target Gretter than current: heat");
						} else if(this.targetTemperature <= currentTemperature - 0.25) {
							//No Heat
							this.gpioPosState = false;
							this.gpioNegState = true;
							this.gpioApply();
							console.log("Target Less than current: no heat");
						} else {
							console.log("No positive test");
						}
					};

					this.interval = setInterval(autoInterval.bind(this), 60*1000);
				break;
			}
		},
		setPositiveAlternance: function (value) {
		    var currentAcova = this;
		    this.rpigpio.write(GPIO_POS, value, function(err) {
		        if (err) throw err;
		        else {
		          if(currentAcova.debug) {
		          		currentAcova.log('GPIO_POS (' + GPIO_POS + ') is now', value ? "High" : "Low");
		          	} else {
		        		console.log(Date(), currentAcova.name, 'GPIO_POS (' + GPIO_POS + ') is now', value ? "High" : "Low");
	        		}
		        }
		    });
			
		},

		setNegativeAlternance: function (value) {
		    var currentAcova = this;
		    this.rpigpio.write(GPIO_NEG, value, function(err) {
		        if (err) throw err;
		        else {
		          if(currentAcova.debug) {
		          	currentAcova.log('GPIO_NEG (' + GPIO_NEG +') is now', value ? "High" : "Low");
		          } else {
		          	console.log(Date(), currentAcova.name, 'GPIO_NEG (' + GPIO_NEG +') is now', value ? "High" : "Low");
		          }
		        }
		    });
			
		},

		gpioApply: function  () {
			if(this.RASPBERRY) {
		  		this.setPositiveAlternance(this.gpioPosState);
		  		this.setNegativeAlternance(this.gpioNegState);
			}
		},

		getTargetState: function() {
			return this.targetState;
		},
		setTargetTemperature: function(value) {
			this.targetTemperature = parseFloat(value);
			return this;
		},
		getTargetTemperature: function() {
			return this.targetTemperature;
		},
		getTargetStateToString: function() {
			var targetStateToString = "";
			switch (this.targetState) {
				case COMFORT : targetStateToString = "COMFORT"; break;
				case COMFORT_MINUS_ONE : targetStateToString =  "COMFORT_MINUS_ONE"; break;
				case COMFORT_MINUS_TWO : targetStateToString =  "COMFORT_MINUS_TWO"; break;
				case ECO : targetStateToString = "ECO"; break;
				case NO_FROST : targetStateToString = "NO_FROST"; break;
				case OFF : targetStateToString = "OFF"; break;
				case AUTO : targetStateToString = "AUTO"; break;
				default: targetStateToString = "Error on getTargetStateToString()";
			}
			return targetStateToString;
		},
		setConfort: function(callback) {
			this.log("COMFORT");
			this.targetState = COMFORT;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setAuto: function(callback) {
			this.log("AUTO");
			this.targetState = AUTO;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setConfortMinusOne: function(callback) {
			this.log("COMFORT_MINUS_ONE");
			this.targetState = COMFORT_MINUS_ONE;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setConfortMinusTwo: function(callback) {
			this.log("COMFORT_MINUS_TWO");
			this.targetState = COMFORT_MINUS_TWO;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setEco: function(callback) {
			this.log("ECO");
			this.targetState = ECO;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setNoFrost: function(callback) {
			this.log("NO_FROST");
			this.targetState = NO_FROST;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setOff: function(callback) {
			this.log("OFF");
			this.targetState = OFF;
			this.updateGPIO();
			if(callback !== undefined) callback();
		}
	};
};