$.ajax({
	url: "http://home.pierrejuliencazaux.com/sensordata",
}).success(function(receivedData) {
    var builtdata = {
        labels: [],
        datasets: [
            {
                label: "Temperatures",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            },
            {
                label: "Humidities",
                fillColor: "rgba(0,220,220,0.0)",
                strokeColor: "rgba(0,220,220,1)",
                pointColor: "rgba(0,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: []
            }
        ]
    };

    for (var i = 0; i < receivedData.length; i++) {
        builtdata.datasets[0].data.push(receivedData[i].temperature);
        builtdata.datasets[1].data.push(receivedData[i].humidity);
        if(i%6 == 0) {
            var date = new Date(receivedData[i].date);
            builtdata.labels.push(date.getHours());
        } else {
            builtdata.labels.push(" ");
        }
    }

    var ctx = $("#chart").get(0).getContext("2d");
    var temperatureChart = new Chart(ctx).Line(builtdata, {
        bezierCurve: true
    });

});


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