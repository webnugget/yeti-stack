'use strict';
var _ = require('lodash'),
    jwt = require('jsonwebtoken');

var users = [{
    id: 1,
    username: 'admin',
    password: 'admin',
    roles: ['admin', 'registered']
}, {
    id: 2,
    username: 'user',
    password: 'user',
    roles: ['registered']
}];

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), process.env.SECRET || 'fapp-stack-secret', {
        expiresInMinutes: process.env.TOKENEXPIRATIONTIME || 1440
    });
}

module.exports.login = function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }

    var user = _.find(users, {
        username: req.body.username
    });
    if (!user) {
        return res.status(401).send("The username or password don't match");
    }

    if (user.password !== req.body.password) {
        return res.status(401).send("The username or password don't match");
    }

    res.status(201).send({
        token: createToken(user)
    });

};

module.exports.signUp = function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("You must send the username and the password");
    }
    if (_.find(users, {
        username: req.body.username
    })) {
        return res.status(400).send("A user with that username already exists");
    }

    var profile = _.pick(req.body, 'username', 'password', 'extra');
    profile.id = _.max(users, 'id').id + 1;
    profile.roles = ['registered'];

    users.push(profile);

    res.status(201).send({
        token: createToken(profile)
    });

};

module.exports.newToken = function(req, res) {
    console.log(req.user);

    res.status(201).send({
        token: createToken(req.user)
    });

};