var express = require('express');
var router = express.Router();

var markerFunctions = require("./markerFunctions");

router.use("/", markerFunctions);

module.exports = router;
