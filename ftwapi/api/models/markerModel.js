var db = require('../db');
var ObjectId = require('mongodb').ObjectID;
var geoPoint = require('geopoint');

/*
 *
 * This function creates a marker for a user
 * @params owner - the username of the user that the marker belongs to
 *         latitude - the new value for geoLocation.latitude
 *         longitude - the new value for geoLocation.longitude
 *         description - the description of the marker
 * @return insertedId - the new created objectId of the created marker
 *
 */
exports.save = function(data, cb){
  var collection = db.get().collection('marker');
  collection.insertOne({
      owner : data.owner,
      geoLocation : {
        latitude: Number(data.latitude),
        longitude: Number(data.longitude)
      },
      description: data.description
    },function(err,result){
    if(err){
      cb({err: "Could not add Marker to database!"});
      return;
    }
    else{
      cb({message: "Successfully added Marker to database!", id: result.insertedId});
    }
  });
}

/*
 *
 * This function removes a marker from the collection using a given objectId
 * @params id - the ObjectId of the marker that shall be deleted
 *
 */
exports.removeMarker = function(data,cb){
  var collection = db.get().collection('marker');
  collection.remove({"_id": ObjectId(data.id)}, function(err,result){
    cb({message: "Deleted marker with id: "+data.id});
  });
}

/*
 *
 * This function delivers all the markers, that have the given username as owner
 * @params owner - the username, which the markers belong to
 * @returns myMarker - all markers of the owner
 *
 */
exports.myMarker = function(data,cb){
 var userCollection = db.get().collection('user');
 var markerCollection = db.get().collection('marker');
 userCollection.findOne({"username" : data.username}, function(err, user){
   if(user == null){
     cb({err: "Wrong user!"});
   }
   else{
     markerCollection.find({"owner": data.username}).toArray(function(err, result){
       cb({myMarker: result});
     });
   }
 });
}

/*
 *
 * This method returns all markers, that belong to friends of the given username
 * @params username - the name of the user, that wants all markers from friends
 * @returns friendsMarker - an array containing all marker information of the users friends
 *
 */
 exports.friendsMarker = function(data,cb){
  var userCollection = db.get().collection('user');
  var markerCollection = db.get().collection('marker');
  userCollection.findOne({"username" : data.username}, function(err, user){
    if(user == null){
      cb({err: "Wrong user!"});
    }
    else{
      var myGeoPointLocation = new geoPoint(user.geoLocation.latitude, user.geoLocation.longitude);
      var customFriendsMarker = [];
      markerCollection.find({"owner": {$in : user.friends}},{ "username":1, "geoLocation": 1, "description":1, "_id":0},{"test": "ok"}).toArray(function(err, result){
        result.forEach(function(elem){
          var tmpGeoPoint = new geoPoint(elem.geoLocation.latitude, elem.geoLocation.longitude);
          var distanceToMe = myGeoPointLocation.distanceTo(tmpGeoPoint, true);
          customFriendsMarker.push({
            username: elem.username,
            geoLocation: elem.geoLocation,
            description: elem.description,
            distance: distanceToMe
          });
        });
        cb({friendsMarker: customFriendsMarker});
      });
    }
  });
 }
