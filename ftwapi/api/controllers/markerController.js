var User = require("../models/userModel");
var Marker = require("../models/markerModel");

exports.test = function(req,res){
  res.send({message: "Marker testmessage"});
}

exports.getMyMarker = function(req,res){
  data = req.params;
  Marker.myMarker(data, function(result){
    res.send(result);
  });
}

exports.getFriendsMarker = function(req,res){
  data = req.params;
  Marker.friendsMarker(data, function(result){
    res.send(result);
  });
}

exports.addMarker = function(req,res){
  data = req.body;
  Marker.save(data, function(result){
    res.send(result);
  });
}

exports.deleteMarker = function(req,res){
  data = req.body;
  Marker.removeMarker(data, function(result){
    res.send(result);
  })
}
