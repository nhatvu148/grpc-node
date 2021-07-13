const path = require("path");

module.exports = {
  development: {
    client: "postgresql",
    connection: {
      host: "127.0.0.1",
      user: "root",
      password: "123456789",
      port: "5432",
      database: "grpc-crud-db",
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: path.join(__dirname, "db", "migrations"),
    },
    seeds: {
      directory: path.join(__dirname, "db", "seeds"),
    },
  },
};
