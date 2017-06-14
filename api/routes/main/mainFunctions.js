var express = require('express');
var router = express.Router();
var main = require("../../controllers/mainController");

router.get("/", main.apiInfo);

module.exports = router;
