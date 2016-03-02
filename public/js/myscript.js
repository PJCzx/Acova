$.ajax({
	url: "/sensordata",
}).success(function(receivedData) {
    var builtdataTemp = {
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
            }
        ]
    };

        var builtdataHumid = {
        labels: [],
        datasets: [
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
        builtdataTemp.datasets[0].data.push(receivedData[i].temperature);
        builtdataHumid.datasets[0].data.push(receivedData[i].humidity);
        if(i%6 == 0) {
            var date = new Date(receivedData[i].date);
            builtdataTemp.labels.push(date.getHours());
            builtdataHumid.labels.push(date.getHours());
        } else {
            builtdataTemp.labels.push(" ");
            builtdataHumid.labels.push(" ");
        }
    }

    var ctx = $("#chart-temperature").get(0).getContext("2d");
    var temperatureChart = new Chart(ctx).Line(builtdataTemp, {
        bezierCurve: true
    });

    var ctx = $("#chart-humidity").get(0).getContext("2d");
    var humidityChart = new Chart(ctx).Line(builtdataHumid, {
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