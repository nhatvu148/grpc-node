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
    call.request.getFirstNumber() + call.request.getSecondNumber()
  );

  callback(null, sumResponse);
};

const greet = (call, callback) => {
  const greeting = new greets.GreetResponse();

  greeting.setResult(
    "Hello " +
      call.request.getGreeting().getFirstName() +
      " " +
      call.request.getGreeting().getLastName()
  );

  callback(null, greeting);
};

function greetManyTimes(call, callback) {
  var firstName = call.request.getGreeting().getFirstName();
  var lastName = call.request.getGreeting().getLastName();

  let count = 0,
    intervalID = setInterval(function () {
      var greetManyTimesResponse = new greets.GreetManyTimesResponse();
      greetManyTimesResponse.setResult(firstName + lastName);

      // setup streaming
      call.write(greetManyTimesResponse);
      if (++count > 9) {
        clearInterval(intervalID);
        call.end(); // we have sent all messages!
      }
    }, 1000);
}

const main = () => {
  const server = new grpc.Server();

  server.addService(calcService.CalculatorServiceService, { sum: sum });

  server.addService(service.GreetServiceService, {
    greet: greet,
    greetManyTimes: greetManyTimes,
  });

  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
  server.start();

  console.log("Server running on port 127.0.0.1:50051");
};

main();
