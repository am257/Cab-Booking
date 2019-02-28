const express = require('express')
const app = express();
let constant = require('../constant/constants')
const userService = require('../services/userServices')
var NodeGeocoder = require('node-geocoder');
let distance = require('google-distance')
distance.apiKey='AIzaSyC7A0EVetIX5j4PEobIlo3KF1MGDHdsKzE'

let options = {
  provider: 'google',
  httpAdapter: 'https', 
  apiKey: 'AIzaSyC7A0EVetIX5j4PEobIlo3KF1MGDHdsKzE', 
  formatter: null      
};
let geocoder = NodeGeocoder(options);

const getProperAddress=(place)=>
{
    return new Promise((resolve, reject)=>{
        
        geocoder.geocode({address: place, country: 'India', city:'Chandigarh'}, function(err, result) {
            if(err)
            {
                
                reject('GEO_ERROR')
            }
            else{
               
                resolve(result[0])
            }
          });

    })
}


const getDistance=(src, dest)=>
{   

    return new Promise((resolve,reject)=>
    {

        
       console.log(src.latitude.toString() + ','+ src.longitude.toString())
        distance.get(
        {
            index: 1,
            origin: src.latitude.toString() + ','+ src.longitude.toString(),
            destination: dest.latitude.toString() + ','+ dest.longitude.toString()
        },
        function(err, data) {
            if (err) 
            { 
                
                reject('DISTANCE_ERROR')
            }
            else{
                
                resolve(data.distance)
            }
                });
            })
}


//user can create booking using this function
const createBookingFunction= async function(req,res){
    try{
        
        let placeInformationSource = await getProperAddress(req.body.source )
        let placeInformationDestination = await getProperAddress(req.body.destination)
        let totalDistance= await getDistance(placeInformationSource, placeInformationDestination)
        console.log(".....=>"+ placeInformationSource.formattedAddress);
        console.log(".......-->"+placeInformationDestination.formattedAddress);
        console.log("=======>"+ totalDistance);
        let insert = await userService.insertBookingDetails(req,res,placeInformationSource.formattedAddress, placeInformationDestination.formattedAddress,totalDistance);           
        let getBookingDetail= await userService.getBookingDetail(req,res);
    if(insert=='')
    {
        res.send({
            error:constant.errorCode[2]

        })
    }
    else{
       // let fare = floor((Math.random() * (300 - 80)) + 80);
        res.send({
            statusCode:200,
            message:" Your booking creation is successfully Completed....",
            data:{
                USER_ID :req.userID,
                "YOUR BOOKING ID ": getBookingDetail[0].booking_id,
                "Pick up Point ":getBookingDetail[0].source,
                "Drop Point ":   getBookingDetail[0].destination,
                "Distance":     getBookingDetail[0].distance,
                "message": "please wait till driver assign....."
            }

        })
    }
    }
    catch(err)
    { 
        
            res.send({
                statusCode:400,
                messsage:"Please enter pickup point and Drop point correctly..."
            })
        
    }
    
}





//complete Booking when journet is finshed
const completeBookingFunction=async (req,res)=>{
 try{
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
        //update booking table into completed status
        let updateBookingTable    = await userService.setBookingTable(getUserDetailsByEmail.user_id);
        if(updateBookingTable=='')
        {
            res.send({
                statusCode:404,
                "message": "No booking is assigned to you right Now"
            })
        }
        else{
            //fetch driver details to change their status 
            let driverDetails= await userService.fetchDriverStatus(getUserDetailsByEmail.user_id);
            if(driverDetails=='')
            {
                res.send({
                    Error: constant.errorCode[3]
                })
            }
            else{
                //set staus of driver as busy again
                let setStatusOfDriver =  await userService.setStatusOfDriverFunction(driverDetails)
                if(setStatusOfDriver=='')
                {
                    res.send({
                        Error: constant.errorCode[2],
                        message: "Driver status Updation Failed.."
                    })
                }
                else{
                    //add driver ratings by the user
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
 catch(err)
 {
     res.send({
         statusCode:400,
         message:"Sorry Your booking Completion request has been failed... "
     })
 }
}





//user can view bookings
const viewBookingFunction=async (req,res)=>
{     try{
    let email = req.email
     let userID= await userService.getUserID(req,res,email);
     let viewUserBookingData = await userService.getUserBookingDetails(userID)
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
   
    res.send({
        statusCode:400,
        message:"No Booking details found for this user...."
    })
}

}


module.exports.createBookingFunction = createBookingFunction;
module.exports.completeBookingFunction = completeBookingFunction;
module.exports.viewBookingFunction= viewBookingFunction;
