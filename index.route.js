const express = require("express");
const fileRoutes = require("./v3/file.route");

const router = express.Router();

router.use("/v3/file", fileRoutes);

module.exports = router;
