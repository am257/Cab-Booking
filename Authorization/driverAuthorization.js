const bcrypt = require('bcrypt')
const saltRounds =10;
const driverService= require('../services/driverServices')
const config= require('../Config/config')
const jwt = require('jsonwebtoken')
const constant= require('../constant/constants')
const passwordToHash=(req,res , next)=>
{
    bcrypt.genSalt(saltRounds,(err,salt)=>
    {
        bcrypt.hash(req.body.confirmPassword , salt , (err, hash)=>
        {
            if(err){
                res.send(
                    {
                        "error":constant.errorCode[2]
                    }
                );
             }
             else{
                 console.log(hash)
                 req.hash = hash;
                 next();
             }
        });
    }); 
}

const  checkCredentialFunction= async (req, res, next)=>{
         let hash = await driverService.getHash(req,res);
         console.log(hash);
         req.hash = hash;
         if(hash==='err')
         {
             res.send({
                 Warning: constant.warnings[0] 
             })
         }
         else{
             next();
         }
}



const hashToPassword= (req, res, next)=>
{
    bcrypt.compare(req.body.password , req.hash, function(err,check){
        if(err)
        {
            res.send({
                error: err.message
            })
        }
        else{
            if(check)
            {
                next()
            }
            else{
                constant.warnings[1];
            }
        }
    } )
}

const generateToken= (req, res, next)=>
{
    const payLoad = {
        email: req.body.email
        }
    jwt.sign(payLoad, config.privateKey, (err, token) => {
        if (err) {
            constant.errorCode[2]
        }
        else {
            req.token = token;
            console.log(token+"{{{{{{{{{{}}}}}}}")
            next();
        }
    });
}

const getEmailByToken=(req,res)=>
{
    return new Promise((resolve,reject)=>
    {
        jwt.verify(req.body.token, config.privateKey,(err,data)=>
        {
            if(err)
            {
                reject('')
            }
            else{
                console.log(data.email)
                resolve(data.email)
            }
        })
    })
}



const validateTokenFunction= async (req,res,next)=>
{
    let email = await getEmailByToken(req,res);
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




module.exports.passwordToHash= passwordToHash;
module.exports.checkCredentialFunction= checkCredentialFunction
module.exports.hashToPassword = hashToPassword
module.exports.generateToken= generateToken

module.exports.validateTokenFunction = validateTokenFunction