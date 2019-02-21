const bcrypt = require('bcrypt')
const saltRounds =10;
const config= require('../Config/config')
const service = require('../services/userServices')
const db = require('../database/dbConnection')
const jwt = require('jsonwebtoken');
const constant=require('../constant/constants')

const checkCredentialsFunction=async function(req,res, next){
    //const email= req.body.email;
    const password= req.body.password;
    let hash= await service.checkEmailExistance(req,res)
    if(hash=='')
    {   res.send({
        Warning: constant.warnings[0]

    })
        
    }
    else{
        bcrypt.compare(password, hash[0].password,function(err,check)
        {
            if(check)
            {
                next();
            }
            else
            { res.send({
               Warning: constant.warnings[1]
            })
                
            }
        })
    }
}


const passwordToHashFunction = function(req,res,next)
{
    bcrypt.genSalt(saltRounds,(err,salt)=>
    {
        bcrypt.hash(req.body.confirmPassword , salt , (err, hash)=>
        {
            if(err){
                res.send(
                    {
                        message:"Please confirm password"
                    }
                );
             }
             else{
                 req.hash= hash;
                 console.log(req.hash)
                 next();
             }
        });
    });    
}



const generateTokenFunction=(req,res, next)=>
{
    const payLoad = {
        email: req.body.email
        }
    jwt.sign(payLoad, config.privateKey, (err, token) => {
        if (err) {
            res.send(
                {
                   ERROR:constant.errorCode[2]
                }
            )
            
        }
        else {
            req.token = token;
            next();
        }
    });
}


const validateTokenFunction= async (req,res,next)=>
{
    let email = await service.getEmailByToken(req,res);
    if(email=='')
    {
        res.send({
            ERROR: constant.warnings[2]
        })
    }
    else{
        req.email= email;
        next();
    }
}

module.exports.checkCredentialsFunction = checkCredentialsFunction
module.exports.passwordToHashFunction = passwordToHashFunction
module.exports.generateTokenFunction= generateTokenFunction;
module.exports.validateTokenFunction = validateTokenFunction