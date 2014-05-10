//helper function to query the database with

var dbConnection = require("./persistent_server.js");

//select first 100 messages in descending order by start date
//return
exports.getFromDatabase = function(){

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
        //check if the room of the new message already exists
        exports.checkInDatabase(newMessage, "roomname", "rooms", "roomname", function(room){
          //new room
          if (room === undefined){
            exports.insertIntoDatabase("rooms", "roomname", newMessage.roomname, function(newRoomId){
              exports.insertMessageIntoDatabase("message", newMessage, newUserId, newRoomId, function(messageId){
                console.log("message #"  + messageId + "saved");
              });
            });
          }
          //old room
          else {

          }
        });
      });
    //old user
    else {


    }
  })

};


  dbConnection.dbConnection.query("SELECT id FROM users WHERE username='" + newMessage.username + "'" , function(err, rows){
    if (err) {
      throw err;
    }
    else{
      if (rows.length === 0){
        dbConnection.dbConnection.query("INSERT INTO users SET ?", {username: newMessage.username}, function(err, result){
          if (err) {throw err;}
          var userId = result.insertId;
          dbConnection.dbConnection.query("INSERT INTO messages" +
          "(user_id, message, room_id, created_at) VALUES ('" + userId + "','" + newMessage.text + "','" +
            roomId + "','" + newMessage.createdAt + "')");
          console.log("new user! Add to user and message database");
        });
      }
      else {
        var userId = rows[0]["id"];
        dbConnection.dbConnection.query("INSERT INTO messages" +
          "(username, text, roomname, createdAt, userId) VALUES ('" + newMessage.username + "','" + newMessage.text + "','" +
            newMessage.roomname + "','" + newMessage.createdAt + "','"+ userId + "')");
        console.log("old user! Add to message database only");
      }
    }
  });


