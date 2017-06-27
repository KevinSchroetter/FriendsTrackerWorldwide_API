var db = require('../db');
//var bcrypt = require('bcrypt');
var geoPoint = require('geopoint');
//const saltRounds = 10;
/*
 *
 * This method creates a new user in the database
 * @params username - the username of the new user
 *         password - the password of the new user
 *         latitude - the geoLocation.latitude of the new user
 *         longitude - the geoLocation.longitude of the new user
 * user.friends will be initialized empty
 * user.description automatically is the username + "location"
 */
exports.save = function(data, cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err, user){
    if(user){
      console.log(user);
      cb({err: "User already exists!"});
    }
    else{
      console.log("User does not exist");
      var description = ""+data.username+"'s Position";
	  collection.insertOne({
            username : data.username,
            password : data.password,
            geoLocation : {
              latitude: Number(data.latitude),
              longitude: Number(data.longitude)
            },
            friends:[] ,
            description: description,
            sentRequests: [],
            openRequests: []
          },function(err,result){
          if(err){
            cb({err: "Could not add User '"+data.username+"' to database!"});
            return;
          }
          else{
            console.log(data.username + " added to database!");
            cb({message: "Successfully added User '"+data.username+"' to database!"});
          }
        });
      /*bcrypt.hash(data.password, saltRounds, function(err, hash){
        collection.insertOne({
            username : data.username,
            password : hash,
            geoLocation : {
              latitude: Number(data.latitude),
              longitude: Number(data.longitude)
            },
            friends:[] ,
            description: description
          },function(err,result){
          if(err){
            cb({err: "Could not add User '"+data.username+"' to database!"});
            return;
          }
          else{
            console.log(data.username + " added to database!");
            cb({message: "Successfully added User '"+data.username+"' to database!"});
          }
        });
      })*/
    }
  });
}

/*
 *
 * This method manages the login using a hash value of the password from the user
 * @params username - the name of the user that wants to log in
 *         password - the hashed password of the user that wants to log in
 *
 */
exports.login = function(data, cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username});
    }
    else{
		if (user.password == data.password){
			cb({success: "Logged in!"});
		}
		else{
			cb({err: "Wrong password!"});
		}
     /* bcrypt.compare(data.password, user.password, function(err,res){
        if(res){
          cb({success: "User logged in!"});
        }
        else{
          cb({err: "Wrong password!"});
        }
      })*/
    }
  })
}

/*
 *
 * This method adds a friend the the friends array of a user
 * @params username - the username of the user that wants to add a friend
 *         friend - the name of a friend, that shall be added
 *
 */
exports.newFriend = function(data,cb){
  if(data.username == data.friend){
    cb({err: "Cannot add yourself to your friends!"});
  }
  else{
    var collection = db.get().collection('user');
    collection.findOne({"username" : data.username}, function(err,user){
      if(user!=null){
        if(user.friends.indexOf(data.friend)>-1){
          cb({message: "Friend already exists"});
        }
        else if(user.sentRequests.indexOf(data.friend)>-1){
          cb({message: "Already sent friendrequest to this user!"});
        }
        else if(user.openRequests.indexOf(data.friend)>-1){
          collection.update({"username":data.username},
          {$pull: {openRequests: data.friend}});
          collection.update({"username":data.friend},
          {$pull: {sentRequests: data.username}});
          collection.update({"username":data.friend},
          {$push: {friends: data.username}});
          collection.update({"username":data.username},
          {$push: {friends: data.friend}});
          cb({message: "Friend added"});
        }
        else{
          collection.findOne({"username" : data.friend}, function(err,user){
            if(user==null){
              cb({err: "Friend not in database!"});
            }
            else{
              collection.update({"username":data.username},
              {$push: {sentRequests: data.friend}});
              collection.update({"username":data.friend},
              {$push: {openRequests: data.username}});
              cb({message: "added friendrequest"});
              console.log(data.username+" added new friendrequest: "+data.friend);
            }
          });
        }
      }
    });
  }
}
exports.confirmFriend = function(data,cb){
  if(data.username == data.friend){
    cb({err: "Cannot add yourself to your friends!"});
  }
  else{
    var collection = db.get().collection('user');
    collection.findOne({"username" : data.username}, function(err,user){
      if(user!=null){
        if(user.friends.indexOf(data.friend)>-1){
          cb({message: "Friend already exists"});
        }
        else if(user.openRequests.indexOf(data.friend)<0){
         cb({message: "Could not confirm, there is no matching request!"});
       }
        else{
          collection.findOne({"username" : data.friend}, function(err,user){
            if(user==null){
              cb({err: "Friend not in database!"});
            }
            else{
              collection.update({"username":data.username},
              {$push: {friends: data.friend}});
              collection.update({"username":data.friend},
              {$push: {friends: data.username}});
              collection.update({"username" : data.username}, {$pull: {openRequests : data.friend}},false,true);
              collection.update({"username" : data.friend}, {$pull: {sentRequests : data.username}},false,true);
              cb({message: "added friend"});
              console.log(data.username+" added new friend: "+data.friend);
            }
          });
        }
      }
    });
  }
}

/*
 *
 * This function updates latitude and longitude of a user
 * @params username - the username of the user that wants to update geoLocation
 *         latitude - the new value for geoLocation.latitude
 *         longitude - the new value for geoLocation.longitude
 *
 */
exports.update = function(data,cb){
  var lat = Number(data.latitude);
  var lon = Number(data.longitude);
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username+"! No update possible!"});
    }
    else{
      collection.update({"username" : data.username}, {
        $set: {geoLocation:
          {
            latitude : lat,
            longitude: lon
          }
        }}, function(err, user){
        if(err){
          cb({err: "Could not update user!"});
        }
        else{
          cb({message: "Successfully updated user "+data.username+"!"});
        }
      });
    }
  });
}

/*
 *
 * This function delivers the friends array of a user
 * @params username - the username that wants to get all friends
 *
 */
exports.allFriends = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
        cb({err: "Could not find user "+data.username});
    }
    else{
      cb(user.friends);
    }
  });
}

/*
 *
 * This function removes a friend from the friends array of a user
 * @params username - the username that wants to remove a friend
 *         friend - the name of a friend, that shall be removed
 *
 */
exports.removeFriend = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username});
    }
    else{
      if(user.friends.indexOf(data.friend)>-1){
        collection.update({"username" : data.username}, {$pull: {friends : data.friend}},false,true);
        collection.update({"username" : data.friend}, {$pull: {friends : data.username}}, false, true);
        cb({message: "Friend removed"});
      }
      else{
        cb({err: "Friend not in friendlist!"});
      }
    }
  })
}
exports.denyFriend = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username});
    }
    else{
      if(user.openRequests.indexOf(data.friend)>-1){
        collection.update({"username" : data.username}, {$pull: {openRequests : data.friend}},false,true);
        collection.update({"username" : data.friend}, {$pull: {sentRequests : data.username}},false,true);
        cb({message: "Friendrequest denied!"});
      }
      else{
        cb({err: "Friend not in requestlist!"});
      }
    }
  })
}

/*
 *
 *  This method returns the username, geoLocation and description of the given user
 * @params username - the user which location shall be returned
 * @returns username - the username of the user
 *          geoLocation - the latitude and longitude of the users Position
 *          description - the description of the geoPoint
 *
 */
exports.myLoc = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username});
    }
    else{
      cb({myLocation: {username: user.username, geoLocation: user.geoLocation, description: user.description}});
    }
  });
}

/*
 *
 * This function returns an array containing username, geoLocation and dscription of friends of a user
 * @params username - the username of the user that wants the position of the friends
 * @returns result - an array containing friends locations, names and descriptions
 */
exports.friendsLoc = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
      cb({err: "Could not find user "+data.username});
    }
    else{
      if(user.friends.length <= 0){
        cb({err: "You have no friends!"});
      }
      else{
        var myGeoPointLocation = new geoPoint(user.geoLocation.latitude, user.geoLocation.longitude);
        var customFriendsLocations = [];
        collection.find({"username": {$in : user.friends}},{ "username":1, "geoLocation": 1, "description":1, "_id":0},{"test": "ok"}).toArray(function(err, result){
          result.forEach(function(elem){
            var tmpGeoPoint = new geoPoint(elem.geoLocation.latitude, elem.geoLocation.longitude);
            var distanceToMe = myGeoPointLocation.distanceTo(tmpGeoPoint, true);
            customFriendsLocations.push({
              username: elem.username,
              geoLocation: elem.geoLocation,
              description: elem.description,
              distance: distanceToMe
            });
          });
          cb({friendsLocation: customFriendsLocations});
        });
      }
    }
  });
}
exports.getRequests = function(data,cb){
  var collection = db.get().collection('user');
  collection.findOne({"username" : data.username}, function(err,user){
    if(user==null){
        cb({err: "Could not find user "+data.username});
    }
    else{
      cb({sentRequests: user.sentRequests, openRequests: user.openRequests});
    }
  });
}
