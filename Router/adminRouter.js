var express = require('express');
const router = express.Router();
const userService = require('../services/userServices')
const adminController = require ('../Controller/adminController');
const userValidator = require('../Validator/userValidator')
const adminAuthorization = require('../Authorization/adminAuthorization')
router.post('/login',           adminAuthorization.hashToPasswordFunction,                  adminController.adminLoginDetails)
router.post('/view-drivers',    adminAuthorization.hashToPasswordFunction,                  adminController.viewDriversFunction)
router.post('/view-pendings',   adminAuthorization.hashToPasswordFunction,                  adminController.viewUserDetailsFunction)
router.post('/driver-assign',   adminAuthorization.hashToPasswordFunction,                  adminController.assignDriverFunction)
//router.post('/view-bookings',   adminAuthorization.hashToPasswordFunction,                  adminController.viewBookingsByAdmin)
router.post('/delete_user',      adminAuthorization.hashToPasswordFunction,                 adminController.deleteUserFunction)
router.post('/remove_driver',    adminAuthorization.hashToPasswordFunction,                  adminController.removeDriverFunction)
module.exports= router
