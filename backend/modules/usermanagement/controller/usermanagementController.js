'use strict';
var _ = rq('lodash'),
    User = rq('userModel');
module.exports.getUserById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(400)
                .send('User not found');
        } else {
            res.json(user);
        }
    });
};
module.exports.updateUserById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(400)
                .send('User not found');
        } else {
            user = _.extend(user, req.body);
            user.updated = Date.now();
            user.save(function (err, user) {
                if (err) {
                    console.log(err);
                    return res.status(400)
                        .send('User could not be updated');
                } else {
                    delete user.password;
                    res.json(user);
                }
            });
        }
    });
};
module.exports.deleteUserById = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) {
            return res.status(400)
                .send('User not found');
        } else {
            user.remove(function (err) {
                if (err) {
                    console.log(err);
                    return res.status(400)
                        .send('User could not be deleted');
                } else {
                    res.json({
                        message: 'User removed successfully'
                    });
                }
            });
        }
    });
};
//list all Users except admins
module.exports.listUsers = function (req, res) {
    User.find({})
        .where('roles')
    //uncomment to exclude users with admin or manager role from userlist
    //.nin(['admin', 'manager'])
    .select('-password')
        .exec(function (err, users) {
            if (err) {
                return res.status(400)
                    .send('You must send the username and the password');
            } else {
                res.json(users);
            }
        });
};