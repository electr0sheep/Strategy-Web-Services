var http = require('http');
var soap = require('soap');

var busService = {
  Bus_Service: {
    Bus_Port: {
      takeBus: function(args) {
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
        var cost = getCost(numMiles);
        var time = getTime(numMiles);

        return {
          message: "To go from " + source + " to " + destination + ", which are "
            + numMiles + " miles apart using a city bus will take you " + time +
            " hours, and will cost you $" + cost
        };
      }
    }
  }
}

var xml = require('fs').readFileSync('BusService.wsdl', 'utf8'),
      server = http.createServer(function(request,response) {
          response.end("404: Not Found: "+request.url)
      });
server.listen(8003);
soap.listen(server, '/wsdl', busService, xml);

getDistance = function(source, destination){
  var distance = Math.random() * 100000;
  distance = Math.floor(distance);
  distance /= 100;

  return distance;
}

getCost = function(distance){
  var cost = distance * 0.5;
  cost *= 100;
  cost = Math.floor(cost);
  cost /= 100;

  return cost;
}

getTime = function(distance){
  var time = distance/60;
  time *= 100;
  time = Math.floor(time);
  time /= 100;

  return time;
}
