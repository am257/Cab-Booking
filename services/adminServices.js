
const db = require('../database/dbConnection')
const Promise= require('bluebird');
const config = require('../Config/config')
const adminAuthorization = require('../Authorization/adminAuthorization')
const mongo= require('../database/mongo')
const constant=require('../constant/constants')


module.exports.checkDatabaseEmpty=()=>
{

    return new Promise( function(resolve, reject){
        db.query("SELECT admin_id FROM admin", function(err,val)
        {
            if(err)
            { 

                reject(err)
            }
            else
            {    
                resolve(val)
            }
        })
    }
    
    )
}

function insertAdminFunction(adminName,adminMail,password)
{   return new Promise((resolve , reject)=>
    {
        db.query("INSERT INTO admin(admin_name, email,password) VALUES (?,?,?)",[adminName,adminMail,password],(err,data)=>
    {
        if(err)
        {   

            reject(err)
        }
        else{
            resolve("Successfully Inserted...")
        }
    })
    })
    
}

module.exports.insertIntoDatabase=()=>
{
    return new Promise((resolve,reject)=>{
        Promise.coroutine(function*(){
        let hashForAdmin1 = yield adminAuthorization.generateHashFunction(config.adminPassword[0])
        let hashForAdmin2 = yield adminAuthorization.generateHashFunction(config.adminPassword[1])
        let insertAdmin1   = yield insertAdminFunction("AKASH DEEP","akash@gmail.com",hashForAdmin1);
        let insertAdmin2   = yield insertAdminFunction("BHARAT BAGGA","bharat@gmail.com",hashForAdmin2);
        resolve('Successfully Completed......')
        })().catch((err)=>{
            reject('ERROR')
        })
        

    })
}
module.exports.getHashValueFunction= (req,res,email)=>
{   
    return new Promise((resolve,reject)=>{
        db.query("SELECT password FROM admin WHERE email =?", [email], (err,data)=>
    {
        if(err)
        {   
            
            reject("DBerror")
        }
        else{
            
            if(data[0]==undefined)
            {
               resolve('');
            }
                else
                {
                   resolve(data[0].password)
                }
            }
    })
    })
    
}


module.exports.fetchAdminDetailsFunction=(email)=>
{
    return new Promise((resolve, reject)=>{

        db.query("SELECT admin_id,admin_name,created_at FROM admin WHERE email=?",email,function(err,val){
            if(err)
            {      
                   reject('')
            }
            else{
                resolve(val)
            }
        })
    })
}

module.exports.fetchDriversByRatings=()=>
{
    return new Promise((resolve , reject)=>
    {
        db.query("SELECT driver_id, driver_name , driver_ratings, driver_ratings FROM driver WHERE status=? ORDER BY driver_ratings DESC ",'free',(err,details)=>
        {
            if(err)
            {
                reject('')
            }
            else{
                resolve(details);
            }
        })
    })
}
module.exports.fetchPendingUsersFunction=()=>
{
    return new Promise((resolve, reject)=>
    {
        db.query("SELECT user_id, booking_id,source, destination FROM booking WHERE booking_status =? order by booking_created_at",['pending'],(err,details)=>
        {
            if(err)
            {
                reject('')
            }
            else{
                resolve(details);
            }
        })
    })
}




module.exports.getAvailableDriver=(req,res)=>
{   
      return new Promise((resolve,reject)=>{
       db.query("SELECT driver_id, car_number FROM driver WHERE status=? AND driver_id=? LIMIT 1", ['free',req.body.driverID],(err,data)=>{
           if(err)
           {
               reject('')
           }
           else{ 
               resolve(data[0])
           }
       })
      })
}

module.exports.assignDriver=(req,res,driverDetails)=>{
    return new Promise((resolve, reject)=>
    {   
   
        db.query("UPDATE booking SET driver_id=?, car_number =?, booking_status=? WHERE booking_status=? AND booking_id= ?",[driverDetails.driver_id, driverDetails.car_number,'assigned','pending', req.body.bookingID], function(err,val)
        {
            if(err)
            {
                reject('')
            }
            else{
                resolve('success')
            }
        })
    })
}

module.exports.updateDriverStatusFunction=(req,res)=>
{
    return new Promise((resolve,reject)=>{
        db.query("UPDATE driver SET status =? WHERE driver_id= ?",['busy', req.body.driverID],(err,data)=>
        {
            if(err)
            {
                reject('error')
            }
            else{
                 resolve('success')
            }
        })
    })
}
module.exports.insertIntoMongoFunction=(req,res)=>
{
    return new Promise((resolve,reject)=>
    {
        db.query("SELECT * FROM booking WHERE booking_id =?", req.body.bookingID,(err,data)=>
        {
            if(err)
            {
                reject('')
            }
            else{ 
                resolve(data[0])
            }
        })
    })
}


