'use strict';
var _ = require('lodash');
/**
 * check if req.user has a role that is allowed to access a route
 * @param  {array} rolesAllowed array of allowed roles
 * @return {express middleware}      calls next if user is allowed to access otherwise an error is passed
 * to next.
 */
module.exports = function (rolesAllowed) {
    return function (req, res, next) {
        if (_.intersection(rolesAllowed, req.user.roles)
            .length > 0) {
            next();
        } else {
            return res.status(401)
                .send('You are not authorized for this action');
        }
    };
};