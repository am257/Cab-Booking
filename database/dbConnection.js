const sqlCred= require('../Config/config')
//MySQL Connection
const mysql=require('mysql');
const connection=mysql.createConnection ({
 host:  sqlCred.mysqlCred.host,
 user:  sqlCred.mysqlCred.user,
 password:  sqlCred.mysqlCred.password,
 database:  sqlCred.mysqlCred.database
});
module.exports=connection