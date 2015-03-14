'use strict';
var rq = require('rekuire'),
    User = rq('userModel'),
    path = rq('path');
var args = process.argv.slice(2);
console.log('args: %s', args);
var username = args[0];
var password = args[1];
var email = args[2];
var roles = ['registered', 'user', 'editor', 'manager', 'admin'];
if (args.length < 3) {
    console.log('usage: node %s %s %s %s', path.basename(process.argv[1]), 'user', 'password', 'email');
    process.exit();
}
console.log('Username: %s', username);
console.log('Password: %s', password);
console.log('Email: %s', email);
console.log('Creating a new user in mongoDB');
var mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE || 'localhost/fapp-stack-dev');
mongoose.connection.on('error', function() {
    console.log('Mongoose connection error', arguments);
});
mongoose.connection.once('open', function callback() {
    console.log('Mongoose connected to the database');
    var user = new User();
    user.username = username;
    user.password = password;
    user.email = email;
    user.roles = roles;
    user.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log(user);
        }
        process.exit();
    });
});