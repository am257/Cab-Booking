var express = require('express');
const router = express.Router();
const driverService= require('../services/driverServices')
const driverController = require ('../Controller/driverController');
const driverValidator = require('../Validator/driverValidator')
const driverAuthorization = require('../Authorization/driverAuthorization')

router.post('/signup',     driverValidator.inputValidationFunction,              driverAuthorization.passwordToHash,               driverService.insertDriverValues)       
router.post('/login',      driverAuthorization.checkCredentialFunction,          driverAuthorization.hashToPassword,               driverAuthorization.generateToken,                 driverController.loginSuccessFunction)
router.post('/view-bookings',  driverAuthorization.validateTokenFunction    ,    driverController.viewBookings);

module.exports= router
