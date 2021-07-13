const greets = require("../server/protos/greet_pb");
const service = require("../server/protos/greet_grpc_pb");

const calc = require("../server/protos/calculator_pb");
const calcService = require("../server/protos/calculator_grpc_pb");

var blogs = require("../server/protos/blog_pb");
var blogService = require("../server/protos/blog_grpc_pb");

const grpc = require("grpc");
let unsafCreds = grpc.credentials.createInsecure();

function callListBlogs() {
  var client = new blogService.BlogServiceClient("localhost:50051", unsafCreds);

  var emptyBlogRequest = new blogs.ListBlogRequest();
  var call = client.listBlog(emptyBlogRequest, () => {});

  call.on("data", (response) => {
    console.log("Client Streaming Response ", response.getBlog().toString());
  });

  call.on("error", (error) => {
    console.error(error);
  });

  call.on("end", () => {
    console.log("End");
  });
}

function callCreateBlog() {
  var client = new blogService.BlogServiceClient("localhost:50051", unsafCreds);

  var blog = new blogs.Blog();
  blog.setAuthor("Bond");
  blog.setTitle("Bond.. blog post");
  blog.setContent("This is okay...");

  var blogRequest = new blogs.CreateBlogRequest();
  blogRequest.setBlog(blog);

  client.createBlog(blogRequest, (error, response) => {
    if (!error) {
      console.log("Received create blog response,", response.toString());
    } else {
      console.error(error);
    }
  });
}

function callReadBlog() {
  var client = new blogService.BlogServiceClient("localhost:50051", unsafCreds);

  var readBlogRequest = new blogs.ReadBlogRequest();
  readBlogRequest.setBlogId("3");

  client.readBlog(readBlogRequest, (error, response) => {
    if (!error) {
      console.log("Found a blog ", response.toString());
    } else {
      if (error.code === grpc.status.NOT_FOUND) {
        console.log("Not Found");
      } else {
        // do something else
      }
    }
  });
}

function callUpdateBlog() {
  var client = new blogService.BlogServiceClient("localhost:50051", unsafCreds);

  var updateBlogRequest = new blogs.UpdateBlogRequest();

  var newBlog = new blogs.Blog();

  newBlog.setId("4");
  newBlog.setAuthor("James Bond now");
  newBlog.setTitle("Hello Up to date");
  newBlog.setContent("This is great, again!");

  updateBlogRequest.setBlog(newBlog);

  console.log("Blog...", newBlog.toString());

  client.updateBlog(updateBlogRequest, (error, response) => {
    if (!error) {
    } else {
      if (error.code === grpc.status.NOT_FOUND) {
        console.log("NOt found");
      } else {
        ///do more...
      }
    }
  });
}

function callDeleteBlog() {
  var client = new blogService.BlogServiceClient("localhost:50051", unsafCreds);

  var deleteBlogRequest = new blogs.DeleteBlogRequest();
  var blogId = "4";

  deleteBlogRequest.setBlogId(blogId);

  client.deleteBlog(deleteBlogRequest, (error, response) => {
    if (!error) {
      console.log("Deleted blog with id: ", response.toString());
    } else {
      if (error.code === grpc.status.NOT_FOUND) {
        console.log("Not Found");
      } else {
        console.log("Sorry something went wrong");
      }
    }
  });
}

const callGreetings = () => {
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

const callSum = () => {
  const client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    unsafCreds,
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
          response.getSumResult(),
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
    unsafCreds,
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

function callLongGreeting() {
  // Created our server client
  var client = new service.GreetServiceClient(
    "localhost:50051",
    unsafCreds,
  );

  var request = new greets.LongGreetRequest();

  var call = client.longGreet(request, (error, response) => {
    if (!error) {
      console.log("Server Response: ", response.getResult());
    } else {
      console.error(error);
    }
  });

  let count = 0,
    intervalID = setInterval(function () {
      console.log("Sending message " + count);

      var request = new greets.LongGreetRequest();
      var greeting = new greets.Greeting();
      greeting.setFirstName("Fuad");
      greeting.setLastName("Akbar");

      request.setGreet(greeting);

      var requestTwo = new greets.LongGreetRequest();
      var greetingTwo = new greets.Greeting();
      greetingTwo.setFirstName("Nhat");
      greetingTwo.setLastName("Vu");

      requestTwo.setGreet(greetingTwo);

      call.write(request);
      call.write(requestTwo);

      if (++count > 3) {
        clearInterval(intervalID);
        call.end(); //we have sent all the messages!
      }
    }, 1000);
}

function callPrimeNumberDecomposition() {
  var client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    unsafCreds,
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

function callComputeAverage() {
  var client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    unsafCreds,
  );

  var request = new calc.ComputeAverageRequest();

  var call = client.computeAverage(request, (error, response) => {
    if (!error) {
      console.log(
        "Received a response from the server - Average: " +
          response.getAverage(),
      );
    } else {
      console.error(error);
    }
  });

  var request = new calc.ComputeAverageRequest();
  // request.setNumber(1)

  for (var i = 0; i < 1000000; i++) {
    var request = new calc.ComputeAverageRequest();
    request.setNumber(i);
    call.write(request);
  }

  call.end();

  // var requestTwo = new calc.ComputeAverageRequest()
  // requestTwo.setNumber(2)

  // var requestThree = new calc.ComputeAverageRequest()
  // requestThree.setNumber(3)

  // var requestFour = new calc.ComputeAverageRequest()
  // requestFour.setNumber(4)

  // average should be 2.5

  //  call.write(request)
  //  call.write(requestTwo)
  //  call.write(requestThree)
  //  call.write(requestFour)

  //  call.end() // we are done sending messages
}

async function sleep(interval) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), interval);
  });
}

async function callBiDirect() {
  // Created our server client
  console.log("hello I'm a gRPC Client");

  var client = new service.GreetServiceClient(
    "localhost:50051",
    unsafCreds,
  );

  var call = client.greetEveryone(request, (error, response) => {
    console.log("Server Response: " + response);
  });

  call.on("data", (response) => {
    console.log("Hello Client!" + response.getResult());
  });

  call.on("error", (error) => {
    console.error(error);
  });

  call.on("end", () => {
    console.log("Client The End");
  });

  for (var i = 0; i < 10; i++) {
    var greeting = new greets.Greeting();
    greeting.setFirstName("Fuad");
    greeting.setLastName("Akbar");

    var request = new greets.GreetEveryoneRequest();
    request.setGreet(greeting);

    call.write(request);

    await sleep(1500);
  }

  call.end();
}

function getRPCDeadline(rpcType) {
  timeAllowed = 5000;

  switch (rpcType) {
    case 1:
      timeAllowed = 10;
      break;

    case 2:
      timeAllowed = 7000;
      break;

    default:
      console.log("Invalid RPC Type: Using Default Timeout");
  }

  return new Date(Date.now() + timeAllowed);
}

function doErrorCall() {
  var deadline = getRPCDeadline(1);

  // Created our server client
  console.log("hello I'm a gRPC Client");

  var client = new calcService.CalculatorServiceClient(
    "localhost:50051",
    unsafCreds,
  );

  var number = -1;
  var squareRootRequest = new calc.SquareRootRequest();
  squareRootRequest.setNumber(number);

  client.squareRoot(
    squareRootRequest,
    { deadline: deadline },
    (error, response) => {
      if (!error) {
        console.log("Square root is ", response.getNumberRoot());
      } else {
        console.log(error.message);
      }
    },
  );
}

const main = async () => {
  callDeleteBlog();
  // callUpdateBlog();
  // callReadBlog();
  // callCreateBlog();
  // callListBlogs();
  // doErrorCall();
  // await callBiDirect();
  // callComputeAverage();
  // callLongGreeting();
  // callPrimeNumberDecomposition();
  // callGreetManyTimes();
  // callGreetings();
  // callSum();
};

main();
