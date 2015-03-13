'use strict';
var logger = require('morgan')('tiny'),
    cors = require('cors'),
    http = require('http'),
    express = require('express'),
    errorhandler = require('errorhandler'),
    cors = require('cors'),
    dotenv = require('dotenv'),
    bodyParser = require('body-parser');

var app = express();

dotenv.load();

// Parsers
// old version of line
// app.use(bodyParser.urlencoded());
// new version of line
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



app.use('/api', require('./modules/auth/routes/authRoutes'));

var port = process.env.PORT || 3000;

http.createServer(app).listen(port, function(err) {
    if (err) {
        console.log(err);
    }
    console.log('listening in http://localhost:' + port);
});