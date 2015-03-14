'use strict';
var _ = rq('lodash'),
    jwt = rq('jsonwebtoken'),
    User = rq('userModel');

function createToken(user) {
    return jwt.sign(_.omit(user, 'password'), process.env.SECRET || 'fapp-stack-secret', {
        expiresInMinutes: process.env.TOKENEXPIRATIONTIME || 1440
    });
}
module.exports.login = function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400)
            .send("You must send the username and the password");
    }
    process.nextTick(function() {
        User.findOne({
            username: req.body.username
        })
            .select('+password')
            .exec(function(err, user) {
                if (err || !user) {
                    return res.status(401)
                        .send("The username or password don't match");
                }
                user.comparePassword(req.body.password, function(err, isMatch) {
                    if (isMatch && !err) {
                        res.status(201)
                            .send({
                                token: createToken(user)
                            });
                    } else {
                        return res.status(401)
                            .send("The username or password don't match");
                    }
                });
            });
    });
};
module.exports.signUp = function(req, res) {
    delete req.body.roles;
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400)
            .send("You must send the username, password and email");
    }
    User.find({
        username: req.body.username
    })
        .exec(function(err, users) {
            if (users.length) {
                return res.status(400)
                    .send("A user with that username already exists");
            } else {
                var user = new User();
                user = _.extend(user, req.body);
                user.save(function(err) {
                    if (err) {
                        console.log(err);
                        return res.status(500)
                            .send("Something went wrong while creating your account");
                    } else {
                        return res.status(201)
                            .send({
                                token: createToken(user)
                            });
                    }
                });
            }
        });
};
module.exports.newToken = function(req, res) {
    res.status(201)
        .send({
            token: createToken(req.user)
        });
};