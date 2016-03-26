
module.exports = function parking (GPIO, raspberry, debug) {
	
	RASPBERRY = raspberry === undefined ? true : raspberry;

	if(RASPBERRY) {
		var rpigpio = require('rpi-gpio');
		rpigpio.setup(GPIO, rpigpio.DIR_OUT);
	}

	return {
		currentState: false,
		open: function () {
			console.log('The garage dor has been open at', Date());
			if(this.RASPBERRY) {
				rpigpio.write(GPIO, true, function() {
					console.log("GPIO (" + GPIO + ") is now HIGH");  
				    setTimeout(function() {
				    	rpigpio.write(false);
						console.log("GPIO (" + GPIO + ") is now LOW");
	  			    } , 1000);
	  			});
	  		}
		}
	};
};