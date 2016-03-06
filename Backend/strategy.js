var http = require('http');
var soap = require('soap');

var strategyService = {
  Strategy_Service: {
    Strategy_Port: {
      getOptions: function(args, callback) {
        var source = "";
        var destination = "";
        var taxi = false;
        var shuttle = false;
        var bus = false;
        var taxiResponse = "N/A";
        var shuttleResponse = "N/A";
        var busResponse = "N/A";

        if (args.source.$value != undefined){
          source = args.source.$value;
          destination = args.destination.$value;
          taxi = getBoolean(args.taxi.$value);
          shuttle = getBoolean(args.shuttle.$value);
          bus = getBoolean(args.bus.$value);
        } else {
          source = args.source;
          destination = args.destination;
          taxi = getBoolean(args.taxi);
          shuttle = getBoolean(args.shuttle);
          bus = getBoolean(args.bus);
        }

        var url;
        var args = {"tns:source":source, "tns:destination":destination};

        if (taxi){
          url = "http://localhost:8001/wsdl?wsdl";
          soap.createClient(url, function(err, client){
            client.Taxi_Service.Taxi_Port.takeTaxi(args, function(err, result){
              if (err) throw err;
              taxiResponse = result.message.substring(0, result.message.length);
              if (!bus && ! shuttle){
                callback({
                  taxi: taxiResponse,
                  bus: busResponse,
                  shuttle: shuttleResponse
                });
              }
              if (bus){
                url = "http://localhost:8003/wsdl?wsdl";
                soap.createClient(url, function(err, client){
                  client.Bus_Service.Bus_Port.takeBus(args, function(err, result){
                    if (err) throw err;
                    busResponse = result.message.substring(0, result.message.length);
                    if (!shuttle){
                      callback({
                        taxi: taxiResponse,
                        bus: busResponse,
                        shuttle: shuttleResponse
                      });
                    }
                    if (shuttle){
                      url = "http://localhost:8002/wsdl?wsdl";
                      soap.createClient(url, function(err, client){
                        client.Shuttle_Service.Shuttle_Port.takeShuttle(args, function(err, result){
                          if (err) throw err;
                          shuttleResponse = result.message.substring(0, result.message.length);
                          callback({
                            taxi: taxiResponse,
                            bus: busResponse,
                            shuttle: shuttleResponse
                          });
                        })
                      })
                    }
                  })
                })
              } else if (shuttle){
                url = "http://localhost:8002/wsdl?wsdl";
                soap.createClient(url, function(err, client){
                  client.Shuttle_Service.Shuttle_Port.takeShuttle(args, function(err, result){
                    if (err) throw err;
                    shuttleResponse = result.message.substring(0, result.message.length);
                    callback({
                      taxi: taxiResponse,
                      bus: busResponse,
                      shuttle: shuttleResponse
                    });
                  });
                });
              }
            });
          });
        } else if (bus){
          url = "http://localhost:8003/wsdl?wsdl";
          soap.createClient(url, function(err, client){
            client.Bus_Service.Bus_Port.takeBus(args, function(err, result){
              if (err) throw err;
              busResponse = result.message.substring(0, result.message.length);
              if (!shuttle){
                callback({
                  taxi: taxiResponse,
                  bus: busResponse,
                  shuttle: shuttleResponse
                });
              }
              if (shuttle){
                url = "http://localhost:8002/wsdl?wsdl";
                soap.createClient(url, function(err, client){
                  client.Shuttle_Service.Shuttle_Port.takeShuttle(args, function(err, result){
                    if (err) throw err;
                    shuttleResponse = result.message.substring(0, result.message.length);
                    callback({
                      taxi: taxiResponse,
                      bus: busResponse,
                      shuttle: shuttleResponse
                    });
                  })
                })
              }
            });
          });
        } else if (shuttle){
          url = "http://localhost:8002/wsdl?wsdl";
          soap.createClient(url, function(err, client){
            client.Shuttle_Service.Shuttle_Port.takeShuttle(args, function(err, result){
              if (err) throw err;
              shuttleResponse = result.message.substring(0, result.message.length);
              callback({
                taxi: taxiResponse,
                bus: busResponse,
                shuttle: shuttleResponse
              });
            });
          });
        } else {
          callback({
            taxi: taxiResponse,
            bus: busResponse,
            shuttle: shuttleResponse
          });
        }
      }
    }
  }
}

var xml = require('fs').readFileSync('StrategyService.wsdl', 'utf8'),
      server = http.createServer(function(request,response) {
          response.end("404: Not Found: "+request.url)
      });
server.listen(8000);
soap.listen(server, '/wsdl', strategyService, xml);

getBoolean = function(string){
  lowerCase = string.toLowerCase();
  if (lowerCase == "true" || lowerCase == "t" || lowerCase == "1"){
    return true;
  } else {
    return false;
  }
}
