module.exports = function TemperatureHumidity (SENSOR_TYPE, SENSOR_GPIO, raspberry, debug) {

	return {
		SENSOR_TYPE: SENSOR_TYPE || 22,
		SENSOR_GPIO: SENSOR_GPIO || 4,
    sensorLib: raspberry == true ? require('node-dht-sensor') : false,
      init: function () {
          if(raspberry == true) {
            return this.sensorLib.initialize(this.SENSOR_GPIO, this.SENSOR_TYPE);
          } else {
            console.log("Not initialised because not a raspberry");
            return this;
          }
      },
      read: function () {
        if (raspberry === true) {
          var readout = this.sensorLib.read();
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
            temperature: 12,
            humidity: 98,
            text: "Raspberry not true: fake value."
          };
        }
      }
  }
};
