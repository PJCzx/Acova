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
var ctx = $("#temperature").get(0).getContext("2d");
var temperatureChart = new Chart(ctx).Line(data, {
    bezierCurve: true
});

var ctx = $("#humidity").get(0).getContext("2d");
var humidityChart = new Chart(ctx).Line(data, {
    bezierCurve: true
});


setInterval(function() {

	$.ajax({
  		url: "/status",
	}).done(function(data) {
  		$("#current").text(data.text);
	});

  	$.ajax({
	  url: "/temperatures",
	}).done(function(data) {
	  var $tbody = $('.temperatures').children("tbody").empty();
	  for (var row of data) {
	  	var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.value + "</td></tr>";
	  	$tbody.append(htmlrow);
	  }
	});


	$.ajax({
	  url: "/humidities",
	}).done(function(data) {
	  var $tbody = $('.humidities').children("tbody").empty();
	  for (var row of data) {
	  	var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.value + "</td></tr>";
	  	$tbody.append(htmlrow);
	  }
	});

	$.ajax({
	  url: "/log",
	}).done(function(data) {
	  var $tbody = $('.log').children("tbody").empty();
	  for (var row of data) {
	  	var htmlrow = "<tr><th>" + row.date + "</th><td>" + row.name + "</td><td>" + row.logline + "</td></tr>";
	  	$tbody.append(htmlrow);
	  }

	//temperatureChart.removeData();
	//temperatureChart.addData([40, 60], new Date().getHours() + ":" + new Date().getMinutes());

	});

}, 5000);