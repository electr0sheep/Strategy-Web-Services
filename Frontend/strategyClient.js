var soap = require('soap');

var url = "http://localhost:8000/wsdl?wsdl";

var args = {
  "tns:source":"Atlanta",
  "tns:destination":"Los Angeles",
  "tns:taxi":"true",
  "tns:shuttle":"true",
  "tns:bus":"false"
};

soap.createClient(url, function(err, client){

  client.Strategy_Service.Strategy_Port.getOptions(args, function(err, result){
    if (err) throw err;
    console.log(result);
  });
});
