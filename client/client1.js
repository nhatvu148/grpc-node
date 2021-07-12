const greets = require("../server/protos/greet_pb");
const service = require("../server/protos/greet_grpc_pb");

const calc = require("../server/protos/calculator_pb");
const calcService = require("../server/protos/calculator_grpc_pb");

const grpc = require("grpc");

const callGreetings = () => {
  console.log("Hello from Client!");
  const client = new service.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  // create our request
  const request = new greets.GreetRequest();

  // create a protocol buffer greeting message
  const greeting = new greets.Greeting();
  greeting.setFirstName("Jerry");
  greeting.setLastName("Tom");

  // set the Greeting
  request.setGreeting(greeting);

  client.greet(request, (error, response) => {
    if (!error) {
      console.log("Greeting Response: ", response.getResult());
    } else {
      console.error(error);
    }
  });
};

const callSum = () => {
  const client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  const sumRequest = new calc.SumRequest();

  sumRequest.setFirstNumber(10);
  sumRequest.setSecondNumber(16);

  client.sum(sumRequest, (error, response) => {
    if (!error) {
      console.log(
        sumRequest.getFirstNumber() +
          " + " +
          sumRequest.getSecondNumber() +
          " = " +
          response.getSumResult()
      );
    } else {
      console.error(error);
    }
  });
};

function callGreetManyTimes() {
  // Created our server client
  var client = new service.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  // create request

  var request = new greets.GreetManyTimesRequest();

  var greeting = new greets.Greeting();
  greeting.setFirstName("Nhat");
  greeting.setLastName("Vu");

  request.setGreeting(greeting);

  var call = client.greetManyTimes(request, () => {});

  call.on("data", (response) => {
    console.log("Client Streaming Response: ", response.getResult());
  });

  call.on("status", (status) => {
    console.log(status.details);
  });

  call.on("error", (error) => {
    console.error(error.details);
  });

  call.on("end", () => {
    console.log("Streaming Ended!");
  });
}

function callPrimeNumberDecomposition() {
  var client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure()
  );

  var request = new calc.PrimeNumberDecompositionRequest();

  var number = 567890; //12

  request.setNumber(number);

  var call = client.primeNumberDecomposition(request, () => {});

  call.on("data", (response) => {
    console.log("Prime Factors Found: ", response.getPrimeFactor());
  });

  call.on("error", (error) => {
    console.error(error);
  });

  call.on("status", (status) => {
    console.log(status);
  });

  call.on("end", () => {
    console.log("Streaming Ended!");
  });
}

const main = () => {
  callPrimeNumberDecomposition();
  // callGreetManyTimes();
  // callGreetings();
  // callSum();
};

main();
