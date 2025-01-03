const express = require("express");
const config = require("./config");
const routes = require("./index.route");

/** Create the server */
const server = express();

/** Use routes */
server.use("/aws-sdk", routes);

server.listen(config.port, () => {
  console.info(`Server listing port no.: `, config.port);
});
