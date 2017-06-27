var express = require('express');
var router = express.Router();
var user = require("../../controllers/userController");

router.get("/", user.test);
router.get("/getFriends/:username", user.getFriends);
router.get("/getMyLocation/:username", user.getMyLocation);
router.get("/getFriendsLocation/:username", user.getFriendsLocation);
router.get("/getRequests/:username",user.getRequests);
router.post("/loginUser", user.loginUser);
router.post("/addUser", user.addUser);
router.put("/addFriend", user.addFriend);
router.put("/updateUser",user.updateUser);
router.put("/confirmFriendRequest", user.confirmFriend);
router.delete("/deleteFriend", user.deleteFriend);
router.delete("/denyFriendRequest", user.denyFriend);

module.exports = router;
