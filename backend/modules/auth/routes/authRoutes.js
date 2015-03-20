'use strict';
var express = rq('express'),
    authController = rq('authController'),
    jwt = require('express-jwt');
var jwtCheck = jwt({
    secret: process.env.SECRET
});
var app = module.exports = express.Router();
app.post('', authController.login);
app.post('/signup', authController.signUp);
app.post('/forgotpassword', authController.forgotPassword);
app.post('/resetpassword/:resetToken', authController.resetPassword);
//The following routes are only available for Users with a valid token
app.use('/newtoken', jwtCheck);
app.get('/newtoken', authController.newToken);