var http = require('http');
var soap = require('soap');

var shuttleService = {
  Shuttle_Service: {
    Shuttle_Port: {
      takeShuttle: function(args) {
        var source = "";
        var destination = "";

        if (args.source.$value != null){
          source = args.source.$value;
          destination = args.destination.$value;
        } else {
          source = args.source;
          destination = args.destination;
        }

        var numMiles = getDistance(source, destination);
        var departure = departureTime(source, destination);
        var time = travelTime(numMiles);

        return {
          message: "To go from " + source + " to " + destination +
          ", using a hotel shuttle will take you " + time +
          " hours. The next departure will occur at " + departure
        };
      }
    }
  }
}

var xml = require('fs').readFileSync('ShuttleService.wsdl', 'utf8'),
      server = http.createServer(function(request,response) {
          response.end("404: Not Found: "+request.url)
      });
server.listen(8002);
soap.listen(server, '/wsdl', shuttleService, xml);

getDistance = function(source, destination){
  var distance = Math.random() * 100000;
  distance = Math.floor(distance);
  distance /= 100;

  return distance;
}

departureTime = function(source, destination){
  var hours;
  var minutes
  var AMPM;

  hours = getRandomInt(1, 12);
  minutes = getRandomInt(0, 59);
  if (getRandomInt(0, 1) == 0){
    AMPM = "AM";
  } else {
    AMPM = "PM";
  }

  if (minutes < 10){
    return hours + ":0" + minutes + " " + AMPM;
  } else {
    return hours + ":" + minutes + " " + AMPM;
  }
}

travelTime = function(distance){
  var hours = distance / 45;
  hours *= 100;
  hours = Math.floor(hours);
  hours /= 100;

  return hours;
}

getRandomInt = function(lowerBound, upperBound){
  return Math.floor((Math.random() * upperBound) + lowerBound);
}
