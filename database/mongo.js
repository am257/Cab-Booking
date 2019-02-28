const mongoDB= require('../Config/config')
const MongoClient = require('mongodb').MongoClient; 
var url = "mongodb://localhost:27017/"; 
MongoClient.connect(url, function(err, db) { 
if (err) throw err; 
console.log("Mongo Database created!"); 
var dbo = db.db(mongoDB.mongoCred.db); 
module.exports.dbo=dbo;


}); 
