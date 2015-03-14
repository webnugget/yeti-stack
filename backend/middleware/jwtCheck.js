//Check if Token is valid and assign User to the request
var jwt = rq('express-jwt');
module.exports = jwt({
    secret: process.env.SECRET || 'fapp-stack-secret'
});