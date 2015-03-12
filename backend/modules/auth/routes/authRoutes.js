'use strict';
var express = require('express'),
    authController = require('../controller/authController.js'),
    jwt = require('express-jwt'),
    config = require('../../../../config');

var jwtCheck = jwt({
    secret: config.secret
});

var app = module.exports = express.Router();


app.post('/auth', authController.login);
app.post('/auth/signup', authController.signUp);

//The following routes are only available for Users with a valid token
app.use('/auth/newtoken', jwtCheck);

app.get('/auth/newtoken', authController.newToken);