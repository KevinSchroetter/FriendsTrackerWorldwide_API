var User = require("../models/userModel");
var Marker = require("../models/markerModel");

exports.test = function(req,res){
  res.send({message: "User testmessage"});
}

exports.addUser = function(req,res){
  data = req.body;
  User.save(data, function(result){
    res.send(result);
  });
}

exports.addFriend = function(req,res){
  data = req.body;
  User.newFriend(data,function(result){
    res.send(result);
  });
}

exports.updateUser = function(req,res){
  data = req.body;
  User.update(data, function(result){
    res.send(result);
  });
}

exports.getFriends = function(req,res){
  data = req.params;
  User.allFriends(data, function(result){
    res.send(result);
  });
}
exports.getMyLocation = function(req,res){
  data = req.params;
  User.myLoc(data, function(result){
    res.send(result);
  });
}

exports.getFriendsLocation = function(req,res){
  data = req.params;
  User.friendsLoc(data, function(result){
    res.send(result);
  });
}

exports.deleteFriend = function(req,res){
  data = req.body;
  User.removeFriend(data, function(result){
    res.send(result);
  });
}

exports.loginUser = function(req,res){
  data = req.body;
  User.login(data, function(result){
    res.send(result);
  })
}
exports.confirmFriend = function(req,res){
  data = req.body;
  User.confirmFriend(data, function(result){
    res.send(result);
  })
}
exports.denyFriend = function(req,res){
  data = req.body;
  User.denyFriend(data, function(result){
    res.send(result);
  })
}
exports.getRequests = function(req,res){
  data = req.params;
  User.getRequests(data, function(result){
    res.send(result);
  })
}
