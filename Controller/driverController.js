const db = require('../database/dbConnection')
const config=require('../Config/config')
const constant=require('../constant/constants')
const driverService=require('../services/driverServices')
const mongo= require('../mongo/mongoLogs')
const loginSuccessFunction= (req,res)=>

{
    db.query("SELECT driver_id, driver_name , driver_email, car_number FROM driver WHERE driver_email= ?",req.body.email,function(err, data)
    {  
        if(err){
            res.send({
                ERROR: constant.errorCode[2]
            })
            
        }
        else{

    }
        res.send({
            statusCode: 200,
            message: "Successfully Log in to you account. WELCOME!!",
            data: 
            {
                DRIVER_ID: data[0].driver_id,
                DRIVER_NAME: data[0].driver_name,
                DRIVER_EMAIL: data[0].driver_email,
                CAR_NUMBER: data[0].car_number,
                "YOUR TOKEN ": req.token
            }
        })
    })
}
const viewBookings=async(req,res)=>
{
    try{
    
        let DriverId= await driverService.getDriverId(req,res,req.email);
        let dID=DriverId.driver_id
        let checkFromMongo= await mongo.printBookingsOfDriver(req,res,dID)
        //console.log(checkFromMongo)
        res.send({
            statusCode:200,
            message: "The details of the driver is below=>",
            data:    checkFromMongo
    
        })
    }
    catch(err){
        if(err=='1')
        {
            res.send({
                statusCode:404,
                message:"No details found"
            })
        }

    }
    
}


module.exports.loginSuccessFunction= loginSuccessFunction
module.exports.viewBookings= viewBookings