const express = require('express')
const app = express();
let constant = require('../constant/constants')
const userService = require('../services/userServices')
//user can create booking using this function
const createBookingFunction= async function(req,res){
    try{
        let insert = await userService.insertBookingDetails(req,res);           
        let getBookingDetail= await userService.getBookingDetail(req,res);
    if(insert=='')
    {
        res.send({
            error:constant.errorCode[2]

        })
    }
    else{
        res.send({
            statusCode:200,
            message:" Your booking creation is successfully Completed....",
            data:{
                USER_ID :req.userID,
                "YOUR BOOKING ID ": getBookingDetail[0].booking_id,
                "Pick up Point ":getBookingDetail[0].source,
                "Drop Point ":   getBookingDetail[0].destination,
                "message": "please wait till driver assign....."
            }

        })
    }
    }
    catch(err)
    { 
        console.log("     llll     "+err)
        res.send({
            statusCode:400,
            messsage:"Please enter pickup point and Drop point correctly..."
        })
    }
    
}

const putFareAmmount=async (req,res)=>{
       const checkStatusOfBooking = await userService.checkStatusOfBookingFunction(req,res)
       if(checkStatusOfBooking == '')
       {
           console.log(checkStatusOfBooking=='')
       }
       else{
           
       }
    
}



//complete Booking when journet is finshed
const completeBookingFunction=async (req,res)=>{
    let email = req.email;
    let getUserDetailsByEmail = await userService.getUserDetailsByEmailFunction(email);
    if(getUserDetailsByEmail==undefined)
    {
        res.send({
            "error":constant.errorCode[2],
            "messsage": "email doesnt exsists...."
        })
    }
    else{
        let updateBookingTable    = await userService.setBookingTable(getUserDetailsByEmail.user_id);
        if(updateBookingTable=='')
        {
            res.send({
                statusCode:404,
                "message": "No booking is assigned to you right Now"
            })
        }
        else{
            let driverDetails= await userService.fetchDriverStatus(getUserDetailsByEmail.user_id);
            if(driverDetails=='')
            {
                res.send({
                    Error: constant.errorCode[3]
                })
            }
            else{
                let setStatusOfDriver =  await userService.setStatusOfDriverFunction(driverDetails)
                if(setStatusOfDriver=='')
                {
                    res.send({
                        Error: constant.errorCode[2],
                        message: "Driver status Updation Failed.."
                    })
                }
                else{
                    //console.log(getUserDetailsByEmail)
                    let putRatings = await userService.addRatingsOnDriver(req,res,driverDetails.driver_id)
                    res.send({
                        statusCode:200,
                        "message": "You have Successfully Complete Your booking....",
                        data:{
                            "USER_ID ":getUserDetailsByEmail.user_id,
                            "USER_NAME":getUserDetailsByEmail.user_name,
                            "USER_EMAIL": getUserDetailsByEmail.user_email,
                            "DRIVER_ID": driverDetails.driver_id,
                            "CAR_NUMBER": driverDetails.car_number.user_id,
                            "BOOKING_ID": driverDetails.booking_id
                        }
                    })
                }
            }
        }
        
    }
}

//user can view bookings
const viewBookingFunction=async (req,res)=>
{     try{
    let email = req.email
    //console.log(email+"........")
     let userID= await userService.getUserID(req,res,email);
    // console.log(userID)
     let viewUserBookingData = await userService.getUserBookingDetails(userID)
    // console.log(viewUserBookingData.user_id);
     res.send({
         statusCode:200,
         message:"Theses are the details of your booking=>",
         data:{
            "Your ID  ": viewUserBookingData.user_id,
            "Your Email ": viewUserBookingData.user_email,
            "Your Booking Id:":viewUserBookingData.booking_id,
            "Assigned Driver :": viewUserBookingData.driver_id,
            "car Number:": viewUserBookingData.car_number,
            "PickUp Point": viewUserBookingData.source,
            "Destination":viewUserBookingData.destination,
            "Booking Creation Time":viewUserBookingData.booking_created_at
         }
     })

}
catch(err)
{
    console.log(err);
    res.send({
        statusCode:400,
        message:"No Booking details found for this user...."
    })
}

}


module.exports.createBookingFunction = createBookingFunction;
module.exports.completeBookingFunction = completeBookingFunction;
module.exports.viewBookingFunction= viewBookingFunction;
