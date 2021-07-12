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

//primeFactor -
function primeNumberDecomposition(call, callback) {
  var number = call.request.getNumber();
  var divisor = 2;

  console.log("Received number: ", number);

  while (number > 1) {
    if (number % divisor === 0) {
      var primeNumberDecompositionResponse =
        new calc.PrimeNumberDecompositionResponse();

      primeNumberDecompositionResponse.setPrimeFactor(divisor);

      number = number / divisor;

      //write the message using call.write()
      call.write(primeNumberDecompositionResponse);
    } else {
      divisor++;
      console.log("Divisor has increased to ", divisor);
    }
  }

  call.end(); // all messages sent! we are done
}

const main = () => {
  const server = new grpc.Server();

  server.addService(calcService.CalculatorServiceService, {
    sum: sum,
    primeNumberDecomposition: primeNumberDecomposition,
  });

  server.addService(service.GreetServiceService, {
    greet: greet,
    greetManyTimes: greetManyTimes,
  });

  server.bind("127.0.0.1:50051", grpc.ServerCredentials.createInsecure());
  server.start();

  console.log("Server running on port 127.0.0.1:50051");
};

main();
