//helper function to query the database with

var dbConnection = require("./persistent_server.js");

//select first 100 messages in descending order by start date
//return
exports.getFromDatabase = function(table, orderby, count, callback){
  dbConnection.dbConnection.query("SELECT * FROM " + table + " ORDER BY " + orderby + " DESC", function(err, rows){
    if (count){
      rows.splice(count);
    }
    callback(rows);
  });
};


//check roomname against rooms
//check username against users
// if in both => add to messages
// if !in rooms => add to rooms => add to messages
// if !in users => add to users => add to messages
// if !in either => add to rooms, add to users => add to messages

//check if room/user of the newMessage already exists in the respective database
exports.checkInDatabase = function(newMessage, property, table, field, callback){
  dbConnection.dbConnection.query("SELECT id FROM " + table + " WHERE "+ field + " = '" + newMessage[property] + "'", function(err, rows){
    if (err){
      throw err;
    }
    else {
      callback(rows[0]);
    }
  });
};

//insert into users/rooms database as new entry
exports.insertIntoDatabase = function(table, field, value, callback){
  dbConnection.dbConnection.query("INSERT INTO " + table + " SET ?", {field: value}, function(err, result){
    if (err){ throw err; }
    callback(result.insertId);
  });
};

//insert into messages database
exports.insertMessageIntoDatabase = function(table, newMessage, userId, roomId, callback){
  dbConnection.dbConnection.query("INSERT INTO " + table + " SET ?",
    { message: newMessage.message,
      user_id: userId,
      room_id: roomId,
      created_at: newMessage.createdAt
    }, function(err, result){
      if (err){ throw err; }
      callback(result.insertId);
    });
};

exports.postToDatabase = function(newMessage){
  //check if the user of the new message already exists
  exports.checkInDatabase(newMessage, "username", "users", "username", function(user){
    //new user, insert into user database
    if (user === undefined){
      exports.insertIntoDatabase("users", "username", newMessage.username, function(newUserId){
        console.log("newusersaved");
        //check if the room of the new message already exists
        exports.checkInDatabase(newMessage, "roomname", "rooms", "roomname", function(room){
          //new room, insert into room database
          if (room === undefined){
            exports.insertIntoDatabase("rooms", "roomname", newMessage.roomname, function(newRoomId){
              console.log("newroomsaved");
              //insert message into messages database
              exports.insertMessageIntoDatabase("message", newMessage, newUserId, newRoomId, function(messageId){
                console.log("message #"  + messageId + "saved");
              });
            });
          }
          //old room
          else {
            //insert message into messages database
            exports.insertMessageIntoDatabase("message", newMessage, newUserId, room.roomname, function(messageId){
              console.log("message #"  + messageId + "saved");
            });
          }
        });
      });
    }
    //old user
    else {
      //check if the room of the new message already exists
      exports.checkInDatabase(newMessage, "roomname", "rooms", "roomname", function(room){
        //new room, insert into room database
        if (room === undefined){
          exports.insertIntoDatabase("rooms", "roomname", newMessage.roomname, function(newRoomId){
            console.log("newroomsaved");
            //insert message into messages database
            exports.insertMessageIntoDatabase("message", newMessage, user.username, newRoomId, function(messageId){
              console.log("message #"  + messageId + "saved");
            });
          });
        }
        //old room
        else {
          //insert message into messages database
          exports.insertMessageIntoDatabase("message", newMessage, user.username, room.roomname, function(messageId){
            console.log("message #"  + messageId + "saved");
          });
        }
      });
    }
  });
};
