var express = require('express');
var router = express.Router();
var marker = require("../../controllers/markerController");

router.get("/test", marker.test);
router.get("/getMyMarker/:username", marker.getMyMarker);
router.get("/getFriendsMarker/:username", marker.getFriendsMarker);
router.post("/addMarker", marker.addMarker);
router.delete("/deleteMarker", marker.deleteMarker);

module.exports = router;
