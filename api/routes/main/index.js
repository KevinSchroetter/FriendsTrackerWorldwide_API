var express = require('express');
var router = express.Router();

var mainFunctions = require("./mainFunctions");

router.use("/", mainFunctions);

module.exports = router;
