var express = require('express');
var router = express.Router();

var userFunctions = require("./userFunctions");

router.use("/", userFunctions);

module.exports = router;
