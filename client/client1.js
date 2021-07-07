const greets = require("../server/protos/greet_pb");
const service = require("../server/protos/greet_grpc_pb");
const grpc = require("grpc");

const main = () => {
  console.log("Hello from Client!");
  const client = new service.GreetServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure(),
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

main();
