
module.exports = function TemperatureHumidity (SENSOR_TYPE, SENSOR_GPIO, raspberry, debug) {

	var sensorLib = raspberry == true ? require('node-dht-sensor') : false;

	return {
		SENSOR_TYPE: SENSOR_TYPE || 22,
		SENSOR_GPIO: SENSOR_GPIO || 4,
      initialize: function () {
          if(sensorLib) return sensorLib.initialize(SENSOR_TYPE, SENSOR_GPIO);
          else {
            return null;
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
