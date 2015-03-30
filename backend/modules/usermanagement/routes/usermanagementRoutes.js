'use strict';
var express = rq('express'),
    usermanagementController = rq('usermanagementController'),
    jwt = rq('express-jwt'),
    rolesCheck = rq('rolesCheck');
var jwtCheck = jwt({
    secret: process.env.SECRET
});
var app = module.exports = express.Router();
//The following routes are only available for Users with admin role
app.use('/', jwtCheck, rolesCheck(['admin']));
app.get('/users', usermanagementController.listUsers);
app.get('/:id', usermanagementController.getUserById);
app.put('/:id', usermanagementController.updateUserById);
app.delete('/:id', usermanagementController.deleteUserById);