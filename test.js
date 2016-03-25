var fs = require('fs');

var item = {
	date: Date(),
	temperature: 20.60,
	humidity: 29.80
};
var sensorData = [];
sensorData.push(item);

fs.writeFile("tmp/sensordata", JSON.stringify(sensorData), function(err) {
    if(err) {
        return console.log(err);
    }
	fs.readFile('tmp/sensordata', 'utf-8', function(err, data) {
	  if (err) throw err;
	  var array = JSON.parse(data);
	  array[0].date;
	});
});