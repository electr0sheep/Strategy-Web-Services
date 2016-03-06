var http = require('http');
var soap = require('soap');

var taxiService = {
  Taxi_Service: {
    Taxi_Port: {
      takeTaxi: function(args) {
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

        return {
          message: "To go from " + source + " to " + destination + ", which are "
            + numMiles + " miles apart will cost $" + cost + " using a taxi",
        };
      }
    }
  }
}

var xml = require('fs').readFileSync('TaxiService.wsdl', 'utf8'),
      server = http.createServer(function(request,response) {
          response.end("404: Not Found: "+request.url)
      });
server.listen(8001);
soap.listen(server, '/wsdl', taxiService, xml);

getDistance = function(source, destination){
  var distance = Math.random() * 100000;
  distance = Math.floor(distance);
  distance /= 100;

  return distance;
}

getCost = function(distance){
  var cost = distance * 1.75;
  cost *= 100;
  cost = Math.floor(cost);
  cost /= 100;

  return cost;
}
