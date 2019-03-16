const adminService = require('../services/adminServices')
const constant=require('../constant/constants')
const mongofile= require('../mongo/mongoLogs')



//Admin Login by check function
module.exports.adminLoginDetails=async(req,res)=>
{
    try{
        let getAdminDetals = await adminService.fetchAdminDetailsFunction(req.body.email)
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
    catch(err)
    {
        res.send({
            statusCode:400,
            message:"Error in admin log in details" 
        })
    }
    
}

//view free Drivers
const viewDriversFunction=async (req,res)=>
{
    let viewDrivers= await adminService.fetchDriversByRatings()   //fetch details by Driver Ratings
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



//To check user whoose requests are pending
const viewUserDetailsFunction=async(req,res)=>
{
    try{
        let pendingUsers = await adminService.fetchPendingUsersFunction()   //fetch function to get pending users
   console.log(pendingUsers.length)
        if(pendingUsers.length==0)
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
    catch(err)
    {
        res.send({
            statusCode:400,
            message: "Error in fetching user details.."
        })
    }
    
}




//assign driver to a perticular booking id
const assignDriverFunction=async (req,res)=>
{
    try{

    
    let availableDriver= await adminService.getAvailableDriver(req,res);  //check driver status free or busy
    if(availableDriver==undefined)
    {
        res.send({
            statusCode:400,
            message: "Sorry !! Driver choosen by you is busy or not availabe...try another driver ID"
        })
    }
    else{   
        let insertDriver = await adminService.assignDriver(req,res,availableDriver); //assign the driver into a pertucular booking
        if(insertDriver =='success')
        {
            let updateDriverStatus= await adminService.updateDriverStatusFunction(req,res)  //Update driver status to busy as it qould be assigned to a booking
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
catch(err)
{
    res.send({
        statusCode:400,
        message: "The credential given by you is not correct...."
    })
}
}



const deleteUserFunction=async (req,res)=>{
    try{
        let user_id = req.body.user_id;
        let sql = "DELETE FROM user WHERE user_id = ?"
        let param=[user_id]
        let deletion = await adminService.deleteUserQuery(sql,param);
        res.send({
            statusCode: 400,
            message: "The user has been successfully Deleted",
            data:
            {
                USER_ID : user_id,
                DELETED: "YES"
            }
        })
    }
    catch(err)
    {
        res.send({
            statusCode: 400,
            message: "The user deletion is failed",
            data:
            {
                USEr_ID : user_id,
                DELETED: "NO"
            }
        })
    }
    
}


const removeDriverFunction =async (req,res)=>
{
    try{
        let driver_id = req.body.driver_id;
        let sql = "DELETE FROM driver WHERE driver_id = ?";
        let param = [driver_id]
        let deletion = await adminService.removeDriverFunction(sql, param);
        res.send({
            statusCode:200,
            message: "Deleted Driver ID",
            data:{
                 Driver_ID: driver_id,
                "Deleted":"YES"
            }
        })

    }
    catch(err)
    {
        res.send({
            statusCode:400,
            message: "Deletion Failed",
            data:
            {
                DRIVER_ID: driver_id,
                DELETED : "NO"
            }
        })

    }

}


module.exports.viewDriversFunction =viewDriversFunction;
module.exports.viewUserDetailsFunction = viewUserDetailsFunction;
module.exports.assignDriverFunction= assignDriverFunction;
module.exports.deleteUserFunction = deleteUserFunction;
module.exports.removeDriverFunction = removeDriverFunction;