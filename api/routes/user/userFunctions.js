var express = require('express');
var router = express.Router();
var user = require("../../controllers/userController");

router.get("/", user.test);
router.get("/getFriends/:username", user.getFriends);
router.get("/getMyLocation/:username", user.getMyLocation);
router.get("/getFriendsLocation/:username", user.getFriendsLocation);
router.post("/loginUser", user.loginUser);
router.post("/addUser", user.addUser);
router.put("/addFriend", user.addFriend);
router.put("/updateUser",user.updateUser);
router.delete("/deleteFriend", user.deleteFriend);

module.exports = router;
