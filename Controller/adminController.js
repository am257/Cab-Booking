const adminService = require('../services/adminServices')
const db = require('../database/dbConnection')
const config= require('../Config/config')
const constant=require('../constant/constants')

const mongofile= require('../mongo/mongoLogs')
module.exports.adminLoginDetails=async (req,res)=>
{
    let getAdminDetals = await adminService.fetchAdminDetailsFunction(req.body.email)
    console.log("....."+getAdminDetals)
    if('')
    {
        res.send({
            "ERROR":constant.errorCode[2]
        })
    }
    else{
        res.send(
            {
                statusCode: 200,
                message:'Successfully Login to your Account',
                data:{
                    Admin_ID: getAdminDetals[0].admin_id,
                    Admin_Name: getAdminDetals[0].admin_name,
                    Admin_creation_Time: getAdminDetals[0].created_at
                     }
            }
        )
        
    }
}


const viewDriversFunction=async (req,res)=>
{
    let viewDrivers= await adminService.fetchDriversByRatings()
    if(viewDrivers==undefined)
    {
        res.send({
            Error: constant.errorCode[2]
        })
    }
    else{
        res.send({
            statusCode: 200,
            message:"The details of free drivers by their ratings--->",
            FREE_DRIVERS: viewDrivers
        })
    }
}

const viewUserDetailsFunction=async(req,res)=>
{
    let pendingUsers = await adminService.fetchPendingUsersFunction()
   // console.log("/////////"+pendingUsers);
    if(pendingUsers=='')
    {
        res.send({
            Error: constant.errorCode[2],
            message: "No booking is pending right now...."

        })
    }
    else{
        res.send({
            Pending_request: pendingUsers
        })
    }
}



const assignDriverFunction=async (req,res)=>
{
    
    let availableDriver= await adminService.getAvailableDriver(req,res);
    if(availableDriver==undefined)
    {
        res.send({
            statusCode:400,
            message: "Sorry.....Driver choosen by you is busy or not availabe...try another"
        })
    }
    else{   
        let insertDriver = await adminService.assignDriver(req,res,availableDriver);
        if(insertDriver =='success')
        {
            let updateDriverStatus= await adminService.updateDriverStatusFunction(req,res)
            if(updateDriverStatus == 'error')
            {
                res.send({
                    statusCode:400,
                    message:"Failed in driver status change query.."
                })
            }
            else{
                let insertIntoMongo= await adminService.insertIntoMongoFunction(req,res);
            
                let insert = await mongofile.insertMongoFunction(req,res,insertIntoMongo)
                if(insert=='')
                {
                    res.send({
                        "message": "failed in mongo query"
                    })
                }
                res.send({
                    statusCode:200,
                    message:"The booking is successfully assignied to user....",
                    data: {
                        "USER_ID": req.body.userID,
                        "DRIVER_ID": req.body.driverID,
                        "CAR_NUMBER": availableDriver.car_number
                    }
                })
            }
        }
        else{
            res.send({
                message: "failed to update..."
            })
        }
        
        
    }
    

}

module.exports.viewDriversFunction =viewDriversFunction;
module.exports.viewUserDetailsFunction = viewUserDetailsFunction;
module.exports.assignDriverFunction= assignDriverFunction;
