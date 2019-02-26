
const Joi = require('joi')
//validate input details of driver signup details
const inputValidationFunction=(req,res,next)=>
{
   let schema = {
       name: Joi.string().required(),
       email: Joi.array().items(Joi.string().email().max(256).required()).single().required(),
       carNumber: Joi.string().min(8).max(20).required(),
       password: Joi.string().min(6).max(50).required(),
       confirmPassword : Joi.any().valid(Joi.ref('password'))
   }
   Joi.validate(req.body, schema, function(err,value) 
   {
       if(err)
       {
        res.status(400).send({
            status : 400,
            message : 'Some error has been occured',
            data : err.details[0].message
        })
       }
       else{
           next();
       }
   })
}

module.exports.inputValidationFunction = inputValidationFunction