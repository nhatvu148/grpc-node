const grpc = require("grpc");
const services = require("../server/protos/dummy_grpc_pb");

const main = () => {
  console.log("Hello from Client!");
  const client = new services.DummyServiceClient(
    "localhost:50051",
    grpc.credentials.createInsecure(),
  );

  // we do stuff
  console.log("Client, ", client)
};

main();
