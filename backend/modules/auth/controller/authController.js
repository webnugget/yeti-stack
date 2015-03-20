'use strict';
var _ = rq('lodash'),
    jwt = rq('jsonwebtoken'),
    async = rq('async'),
    crypto = rq('crypto'),
    authMailer = rq('authMailer'),
    User = rq('userModel');

function createToken(user) {
    // delete properties that should not be included in token
    delete user.password;
    delete user.__v;
    return jwt.sign(user, process.env.SECRET, {
        expiresInMinutes: process.env.TOKENEXPIRATIONTIME || 1440
    });
}
module.exports.login = function (req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400)
            .send("You must send the username and the password");
    }
    process.nextTick(function () {
        User.findOne({
            username: req.body.username
        })
            .select('+password')
            .exec(function (err, user) {
                if (err || !user) {
                    return res.status(401)
                        .send("The username or password don't match");
                }
                user.comparePassword(req.body.password, function (err, isMatch) {
                    if (isMatch && !err) {
                        res.status(201)
                            .send({
                                token: createToken(user.toObject())
                            });
                    } else {
                        return res.status(401)
                            .send("The username or password don't match");
                    }
                });
            });
    });
};
module.exports.signUp = function (req, res) {
    delete req.body.roles;
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400)
            .send("You must send the username, password and email");
    }
    User.find({
        username: req.body.username
    })
        .exec(function (err, users) {
            if (users.length) {
                return res.status(400)
                    .send("A user with that username already exists");
            } else {
                var user = new User();
                user = _.extend(user, req.body);
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500)
                            .send("Something went wrong while creating your account");
                    } else {
                        //authMailer needs following params
                        //reciever,subject,template,context,callback
                        authMailer(user.email, 'Your registration for ' + process.env.APPNAME, 'signup', {
                            user: user
                        });
                        return res.status(201)
                            .send({
                                token: createToken(user.toObject())
                            });
                    }
                });
            }
        });
};
module.exports.newToken = function (req, res) {
    res.status(201)
        .send({
            token: createToken(req.user)
        });
};
module.exports.forgotPassword = function (req, res) {
    async.waterfall([

    function (done) {
            crypto.randomBytes(20, function (err, buf) {
                var token = buf.toString('hex');
                done(err, token);
            });
    },
    function (token, done) {
            User.findOne({
                username: req.body.username
            }, function (err, user) {
                if (!user) {
                    done('no user found for following email: ' + req.body.email);
                } else {
                    user.resetPasswordToken = token;
                    user.resetPasswordExpires = Date.now() + 24 * 3600000; // 1 hour
                    user.save(function (err) {
                        done(err, token, user);
                    });
                }
            });
    },
    function (token, user, done) {
            var context = {
                user: user,
                url: 'http://' + req.headers.host + '/#!/reset/' + token
            };
            //authMailer needs following params
            //reciever,subject,template,context,callback
            authMailer(user.email, 'Reset your password for ' + process.env.APPNAME, 'forgotpassword', context);
            done();
    }
  ], function (err) {
        if (err) {
            console.log(err);
        }
        return res.status(200)
            .send('please check your inbox');
    });
};
module.exports.resetPassword = function (req, res) {
    User.findOne({
        resetPasswordToken: req.params.resetToken,
        resetPasswordExpires: {
            $gt: Date.now()
        }
    }, function (err, user) {
        if (!user || err) {
            return res.status(401)
                .send('Reset-Token is invalid, please request a new one');
        } else {
            user.password = req.body.password;
            user.resetPasswordExpires = null;
            user.resetPasswordExpires = null;
            user.save(function (err) {
                if (err) {
                    return res.status(500)
                        .send('An Error occured while saving your new password');
                }
                return res.status(200)
                    .send({
                        token: createToken(user.toObject())
                    });
            });
        }
    });
};