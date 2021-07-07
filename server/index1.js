const greets = require("../server/protos/greet_pb");
const service = require("../server/protos/greet_grpc_pb");

const calc = require("../server/protos/calculator_pb");
const calcService = require("../server/protos/calculator_grpc_pb");

const grpc = require("grpc");

/*
  Implements the RPC methods
*/
const sum = (call, callback) => {
  const sumResponse = new calc.SumResponse();

  sumResponse.setSumResult(
    call.request.getFirstNumber() + call.request.getSecondNumber(),
  );

  callback(null, sumResponse);
};

const greet = (call, callback) => {
  const greeting = new greets.GreetResponse();

  greeting.setResult(
    "Hello " + call.request.getGreeting().getFirstName() +
      " " + call.request.getGreeting().getLastName(),
  );

  callback(null, greeting);
};

const main = () => {
  const server = new grpc.Server();
  // server.addService(service.GreetServiceService, { greet: greet });
  server.addService(calcService.CalculatorServiceService, { sum: sum });

  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
  server.start();

  console.log("Server running on port 127.0.0.1:50051");
};

main();
