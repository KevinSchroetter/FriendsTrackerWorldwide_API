var express = require('express');
var router = express.Router();

var user = require("./user");
var marker = require("./marker");

router.use("/user", user);
router.use("/marker",marker);

module.exports = router;
