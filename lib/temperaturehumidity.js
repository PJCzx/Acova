module.exports = function TemperatureHumidity (SENSOR_TYPE, SENSOR_GPIO, raspberry, debug) {
  var sensorLib = false;
	if(raspberry == true ) {
    console.log("Is the node-dht-sensor available ?");
    sensorLib = require('node-dht-sensor');
    console.log("yes");
  }
	return {
		SENSOR_TYPE: SENSOR_TYPE || 22,
		SENSOR_GPIO: SENSOR_GPIO || 4,
      init: function () {
          if(sensorLib) {
            console.log("Init");
            return sensorLib.initialize(22, 4);
          } else {
            console.log("Not initialised because not a raspberry");
            return this;
          }
      },
      read: function () {
        if (sensorLib == true) {
          var readout = sensorLib.read();
          var text = 'Temperature: ' + readout.temperature.toFixed(2) + 'C, ' +'humidity: ' + readout.humidity.toFixed(2) + '%';
          //console.log(text);
          return {
            date: new Date(),
            temperature: readout.temperature.toFixed(2),
            humidity: readout.humidity.toFixed(2),
            text: text
          };
        } else {
          return {
            date: new Date(),
            temperature: -1,
            humidity: -1,
            text: "Raspberry not true: fake value."
          };
        }
      }
  }
};
