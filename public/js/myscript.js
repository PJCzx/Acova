/*var datachartist = {
  // A labels array that can contain any sort of values
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  // Our series array that contains series objects or in this case series data arrays
  series: [
    [5]
  ]
};*/

// Create a new line chart object where as first parameter we pass in a selector
// that is resolving to our chart container element. The Second parameter
// is the actual data object.
//var chartistGraph = new Chartist.Line('.ct-chart', datachartist);

/*
var data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [65, 59, 80, 81, 56, 55, 40]
        },
        {
            label: "My Second dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(151,187,205,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: [28, 48, 40, 19, 86, 27, 90]
        }
    ]
};


var temperatures = {
    labels: ["Init"],
    datasets: [
        {
            label: "Temperatures",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: [19]
        }
    ]
};

var ctx = $("#temperature").get(0).getContext("2d");
var temperatureChart = new Chart(ctx).Line(temperatures, {
    bezierCurve: true
});

var ctx = $("#humidity").get(0).getContext("2d");
var humidityChart = new Chart(ctx).Line(data, {
    bezierCurve: true
});


$.ajax({
	url: "/temperatures",
}).success(function(data) {
	for (var row of data) {
		temperatures.labels.push(row.date);

		//temperatures.datasets[0].data.push(row.value);
		datachartist.series[0].push(row.value);
	}
	//temperatureChart.update();

});
*/

setInterval(function() {

	$.ajax({
  		url: "/status",
	}).done(function(data) {
  		$("#status-state").text(data.state);
        $("#status-temperature").text(data.temperature);
        $("#status-humidity").text(data.humidity);
	});
/*
  	$.ajax({
		url: "/temperatures",
	}).success(function(data) {
	  	var $tbody = $('.temperatures').children("tbody").empty();
	  	//datachartist.series[0] = [];
	  	//datachartist.labels = [];
	  	for (var row of data) {
	  		var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.value + "</td></tr>";
	  		$tbody.prepend(htmlrow);
			//datachartist.labels.push(row.date);
			//datachartist.series[0].push(row.value);
		}
		//chartistGraph.update();
	});


	$.ajax({
	  url: "/humidities",
	}).done(function(data) {
	  var $tbody = $('.humidities').children("tbody").empty();
	  for (var row of data) {
	  	var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.value + "</td></tr>";
	  	$tbody.prepend(htmlrow);
	  }
	});
*/
	$.ajax({
	  url: "/log",
	}).done(function(data) {
	  var $tbody = $('.log').children("tbody").empty();
	  for (var row of data) {
	  	var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.name + "</td><td>" + row.logline + "</td></tr>";
	  	$tbody.prepend(htmlrow);
	  }
	});

}, 5000);