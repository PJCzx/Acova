
module.exports = function Acova (name, GPIO_POS, GPIO_NEG, raspberry) {

	COMFORT = 0;
	COMFORT_MINUS_ONE = 1;
	COMFORT_MINUS_TWO = 2;
	ECO = 3;
	NO_FROST = 4;
	OFF = 5;

	RASPBERRY = raspberry === undefined ? true : raspberry;
	
	if(RASPBERRY) {
		var rpigpio = require('rpi-gpio');
		rpigpio.setup(GPIO_POS, rpigpio.DIR_OUT);
		rpigpio.setup(GPIO_NEG, rpigpio.DIR_OUT);
	}

	return {
		currentState: COMFORT,
		name: name || "NO NAME",
		interval: null,
		updateGPIO: function () {
			switch (this.currentState) {
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

					var t = this;

					var loop = function () {
					 	//set 3 sec
						t.gpioPosState = true;
						t.gpioNegState = true;
						t.gpioApply();

					 	setTimeout(function(){
							t.gpioPosState = false;
							t.gpioNegState = false;
							t.gpioApply();
					 	}, 3*1000);
					};

					loop();
					this.interval = setInterval(loop, 5*60*1000);
				break;
				
				case COMFORT_MINUS_TWO:
					//7 SEC EVERY 5 MIN
					if(this.interval !== null) clearInterval(this.interval);
					
					var t = this;
					var loop = function () {
					 	//set 7 sec
						t.gpioPosState = true;
						t.gpioNegState = true;
						t.gpioApply();

					 	setTimeout(function(){
							t.gpioPosState = false;
							t.gpioNegState = false;
							t.gpioApply();
					 	}, 7*1000);
					}

					loop();
					this.interval = setInterval(loop, 5*60*1000);
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
			};
		},
		setPositiveAlternance: function (value) {
		    var currentAcova = this;
		    rpigpio.write(GPIO_POS, value, function(err) {
		        if (err) throw err;
		        else {
		          console.log(Date(), currentAcova.name, 'GPIO_POS (' + GPIO_POS + ') is now', value ? "High" : "Low");
		        }
		    });
			
		},

		setNegativeAlternance: function (value) {
		    var currentAcova = this;
		    rpigpio.write(GPIO_NEG, value, function(err) {
		        if (err) throw err;
		        else {
		          console.log(Date(), currentAcova.name, 'GPIO_NEG (' + GPIO_NEG +') is now', value ? "High" : "Low");
		        }
		    });
			
		},

		gpioApply: function  () {
			if(this.RASPBERRY) {
		  		this.setPositiveAlternance(this.gpioPosState);
		  		this.setNegativeAlternance(this.gpioNegState);
			}
		},

		getCurrentState: function() {
			return this.currentState;
		},
		getCurrentStateToString: function() {
			var currentStateToString = "";
			switch (this.currentState) {
				case COMFORT : currentStateToString = "COMFORT"; break;
				case COMFORT_MINUS_ONE : currentStateToString =  "COMFORT_MINUS_ONE"; break;
				case COMFORT_MINUS_TWO : currentStateToString =  "COMFORT_MINUS_TWO"; break;
				case ECO : currentStateToString = "ECO"; break;
				case NO_FROST : currentStateToString = "NO_FROST"; break;
				case OFF : currentStateToString = "OFF"; break;
				default: currentStateToString = "Error on getCurrentStateToString()";
			}
			return currentStateToString;
		},
		setConfort: function(callback) {
			console.log(Date(), this.name, "COMFORT");
			this.currentState = COMFORT;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setConfortMinusOne: function(callback) {
			console.log(Date(), this.name, "COMFORT_MINUS_ONE");
			this.currentState = COMFORT_MINUS_ONE;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setConfortMinusTwo: function(callback) {
			console.log(Date(), this.name, "COMFORT_MINUS_TWO");
			this.currentState = COMFORT_MINUS_TWO;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setEco: function(callback) {
			console.log(Date(), this.name, "ECO");
			this.currentState = ECO;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setNoFrost: function(callback) {
			console.log(Date(), this.name, "NO_FROST");
			this.currentState = NO_FROST;
			this.updateGPIO();
			if(callback !== undefined) callback();
		},
		setOff: function(callback) {
			console.log(Date(), this.name, "OFF");
			this.currentState = OFF;
			this.updateGPIO();
			if(callback !== undefined) callback();
		}
	};
};