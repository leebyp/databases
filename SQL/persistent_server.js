var mysql = require("mysql");
var http = require("http");
var fs = require("fs");
var server = require("../chatterbox-server/server/basic-server.js");

//==============================================================================================================//
//
// The basic server is created immediately simply a require here.
// request-handler.js from the chatterbox-server app gains access to the SQL database from the functions here
//
//==============================================================================================================//



/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
exports.dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chat"
});

exports.dbConnection.connect(
  console.log("Database has been connected!")
);

// dbConnection.query('SELECT u.username FROM users u', function(err, rows, field){
//   console.log(rows, field);
// });
/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/

/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */
