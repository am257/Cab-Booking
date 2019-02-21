module.exports={
        errorCode:[
            {
                statusCode: 400,
                message:" ERROR OCCURED ! BAD REQUEST",
                data:{
    
                }
            },
            {
                statusCode: 401,
                message:" ERROR OCCURED ! INVALID",
                data:{
    
                }
            },
            {
                statusCode: 404,
                message:" ERROR OCCURED ! NOT FOUND",
                data:{
    
                }
            },
            {
                statusCode: 409,
                message:" ERROR OCCURED ! CONFLICT",
                data:{
    
                }
            }
        ],
        warnings:[
            {
                statusCode: 400,
                message: "Please Enter Valid Email"
            },
            {
                statusCode: 401,
                message:" Please Enter Valid Password"
            },
            {
                statusCode: 400,
                message: " Please Enter valid token"
            }
        ]
}