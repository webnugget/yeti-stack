'use strict';
var path = rq('path'),
    debug = rq('debug'),
    nodemailer = rq('nodemailer'),
    hbs = rq('nodemailer-express-handlebars'),
    smtpTransport = rq('nodemailer-smtp-transport'),
    transport = nodemailer.createTransport(smtpTransport({
        host: process.env.MAILHOST,
        port: process.env.MAILPORT,
        auth: {
            user: process.env.MAILUSER,
            pass: process.env.MAILPASSWORD
        }
    }));
module.exports = function (reciever, subject, template, context, callback) {
    //Use handlebarstemplate for mail
    transport.use('compile', hbs({
        viewEngine: {
            extname: '.hbs',
            layoutsDir: path.join(__dirname, '..', 'templates'),
            defaultLayout: 'template',
            partialsDir: path.join(__dirname, '..', 'templates')
        },
        viewPath: path.join(__dirname, '..', 'templates'),
        extName: '.hbs'
    }));
    //Send mail
    transport.sendMail({
        from: process.env.APPNAME + ' <' + process.env.EMAILADDRESS + '>', // sender address
        to: reciever, // list of receivers
        subject: subject, // Subject line
        template: template,
        context: context
    }, function (err, response) {
        if (err) {
            console.log('Error while sending Mail to user: ' + reciever);
            callback(err);
        } else {
            debug('Message sent: ' + response.message);
            callback(null);
        }
    });
};