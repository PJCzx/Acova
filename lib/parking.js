
module.exports = function parking (GPIO) {
	
	var rpigpio = require('rpi-gpio');
	rpigpio.setup(GPIO, rpigpio.DIR_OUT);

	return {
		currentState: false,
		open: function () {
			console.log('The garage dor has been open at', Date());
			gpio.write(GPIO, true, function() {
				console.log("GPIO (" + GPIO + ") is now HIGH");  
			    setTimeout(function() {
			    	gpio.write(false);
					console.log("GPIO (" + GPIO + ") is now LOW");
  			    } , 1000);
  			});
		}
	};
};