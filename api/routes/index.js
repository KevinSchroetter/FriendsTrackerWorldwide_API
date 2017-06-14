var express = require('express');
var router = express.Router();

var user = require("./user");
var marker = require("./marker");
var main = require("./main");

router.use("/", main);
router.use("/user", user);
router.use("/marker",marker);

module.exports = router;
