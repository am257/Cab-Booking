const saltRounds=10;
const Promise= require('bluebird')
const bcrypt = require('bcrypt')
const config = require('../Config/config')
const constant=require('../constant/constants')

const adminService = require('../services/adminServices')
module.exports.generateHashFunction= (password)=>
{
    return new Promise((resolve,reject)=>{
        bcrypt.genSalt(saltRounds,(err,salt)=>
    {
        bcrypt.hash(password , salt , (err, hash)=>
        {
            if(err){
                reject(err)
             }
             else{
                 resolve(hash)
             }
        });
     }); 
            
   })
}


const hashToPasswordFunction= async (req,res, next)=>
{   
    let hash = await adminService.getHashValueFunction(req, res, req.body.email)
    console.log(hash+"thosjsj")
    if(hash=='')
    {
        res.send(constant.warnings[0])

    }
    else{
        bcrypt.compare(req.body.password, hash,(err,bool)=>
        {
            if(err)
            {   
                throw err;
            }
            else{
                if(bool)
                {   
                    
                    next()
                }
                else{
                    res.send({
                        Warning: constant.warnings[1]
                    })
                    
                }
            }
        })
    }
   
}


module.exports.hashToPasswordFunction= hashToPasswordFunction;