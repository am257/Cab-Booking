const db = require('../database/dbConnection')
const Promise= require('bluebird');
const config = require('../Config/config')
const adminAuthorization = require('../Authorization/adminAuthorization')
const mongo= require('../database/mongo')

module.exports.insertMongoFunction=(req,res,details)=>
{   

    return new Promise((resolve, reject)=>
    {  
        const schema={
            "booking ID": req.body.bookingID,
            "user_id":details.user_id,
            "Driver_ID":details.driver_id,
            "car_number":details.car_number,
            "Journey_Details":{
                "source":details.source,
                "Destination":details.destination
            }
            ,
            "BOOKING_CREATION_TIME": details.booking_created_at,
            "BOOKING_STATUS":details.booking_status,
            "BOKKING_COMPLETED_AT":details.booking_completed_at
        }
        
    
       mongo.dbo.collection(config.mongoCred.collection).insertOne(schema,(err,result)=>
       {
           if(err){
                reject('')
           }
           else{
                resolve(result)
           }

       })
    })
}



module.exports.printBookingsOfDriver=(req,res,dID)=>{
    return new Promise((resolve,reject)=>
    {
        
      mongo.dbo.collection(config.mongoCred.collection).find({"Driver_ID":dID.toString()}).toArray(function(err,val){
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