var express = require('express');
const router = express.Router();
const userService = require('../services/userServices')
const userController = require ('../Controller/userController');
const userValidator = require('../Validator/userValidator')
const userAuthorization = require('../Authorization/userAuthorization')

router.post('/signup',                      userValidator.inputValidateFunction,                   userAuthorization.passwordToHashFunction,            userService.addSignupFunction )
router.post('/login',                       userAuthorization.checkCredentialsFunction,            userAuthorization.generateTokenFunction,             userService.fetchLoginDetails)
router.post('/create-booking',              userAuthorization.validateTokenFunction,               userController.createBookingFunction)
router.post('/view-bookings',               userAuthorization.validateTokenFunction ,              userController.viewBookingFunction)
router.post('/booking-complete',            userAuthorization.validateTokenFunction ,              userController.completeBookingFunction )
router.post('/forgot_password',        userAuthorization.validateTokenFunction,               userController.forgotPasswordFunction )
module.exports=router;