'use strict';
var logger = require('morgan')('tiny'),
    cors = require('cors'),
    debug = require('debug')('app:' + process.pid),
    http = require('http'),
    express = require('express'),
    errorhandler = require('errorhandler'),
    cors = require('cors'),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose');

var app = express();

dotenv.load();
// MongoDB
mongoose.set('debug', false);
mongoose.connect(process.env.DATABASE || 'localhost/fapp-stack-dev');
mongoose.connection.on('error', function() {
    debug('Mongoose connection error');
});
mongoose.connection.once('open', function callback() {
    debug('Mongoose connected to the database');
});


// Parsers
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(cors());



if (process.env.NODE_ENV === 'development') {
    app.use(logger);
    app.use(errorhandler());  
    app.use(require('connect-livereload')({    
        port:  35729  
    }));
}

app.use(express.static(__dirname + '/../www'));

app.use(function(err, req, res, next) {
    if (err.name === 'StatusError') {
        res.send(err.status, err.message);
    } else {
        next(err);
    }
});


//Auth-Routes
app.use('/api/auth', require('./modules/auth/routes/authRoutes'));

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    console.log('listening in http://localhost:' + port);
});