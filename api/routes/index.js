var express = require('express');
var router = express.Router();

var user = require("./user");
var marker = require("./marker");
var main = require("./main");

router.use("/user", user);
router.use("/marker",marker);
router.use("/main", main);

module.exports = router;
