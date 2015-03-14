'use strict';
var express = rq('express'),
    authController = rq('authController'),
    jwt = rq('express-jwt');

var jwtCheck = jwt({
    secret: process.env.SECRET || 'fapp-stack-secret'
});

var app = module.exports = express.Router();


app.post('', authController.login);
app.post('/signup', authController.signUp);

//The following routes are only available for Users with a valid token
app.use('/newtoken', jwtCheck);

app.get('/newtoken', authController.newToken);