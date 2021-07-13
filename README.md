# grpc-node

To get started, make sure to install the NPM dependencies:

`$ yarn`

# Commands:

- yarn global add grpc-tools
- protoc -I=. ./protos/dummy.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
- protoc -I=. ./protos/greet.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
- protoc -I=. ./protos/calculator.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
- protoc -I=. ./protos/blog.proto --js_out=import_style=commonjs,binary:./server
  --grpc_out=./server
  --plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`

Windows:

- protoc -I=. ./protos/dummy.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=C:/Users/TechnoStar/AppData/Local/Yarn/bin/grpc_tools_node_protoc_plugin.cmd
- protoc -I=. ./protos/greet.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=C:/Users/TechnoStar/AppData/Local/Yarn/bin/grpc_tools_node_protoc_plugin.cmd
- protoc -I=. ./protos/calculator.proto
  --js_out=import_style=commonjs,binary:./server --grpc_out=./server
  --plugin=protoc-gen-grpc=C:/Users/TechnoStar/AppData/Local/Yarn/bin/grpc_tools_node_protoc_plugin.cmd
- protoc -I=. ./protos/blog.proto --js_out=import_style=commonjs,binary:./server
  --grpc_out=./server
  --plugin=protoc-gen-grpc=C:/Users/TechnoStar/AppData/Local/Yarn/bin/grpc_tools_node_protoc_plugin.cmd

# PostgreSQL:

- cd server && ../node_modules/.bin/knex migrate:make blogs
- ../node_modules/.bin/knex migrate:latest
- ../node_modules/.bin/knex seed:make blogs
- ../node_modules/.bin/knex seed:run

# Evans CLI:

- https://github.com/ktr0731/evans
- evans protos/greet.proto
