const fs              = require('fs');
//const fr            = require('face-recognition');
//const cv              = require('opencv4nodejs')
//const fr              = require('face-recognition').withCv(cv)
const express         = require('express');
const https           = require('https');
const bodyParser      = require('body-parser');
const path            = require('path');
const jsonParser	  = require('body-parser').json();
const app             = module.exports=express();


var api = require('./api');
var router = express.Router()
// Use the default path '/' (Not recommended)
// app.use(mockjs(path.join(__dirname, 'mocks')))
app.use(bodyParser.urlencoded({ extended: true }));
app.use( bodyParser.json());
app.use(express.static(path.join(__dirname, '../dist')));
// Use a custom path '/api'

app.use(function(req,res,next){
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
//
    // Pass to next layer of middleware
    next();
});
app.use('/api',api);
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Here you can add any code.

app.listen(3000,()=>{console.log("Server running port: 3000!")});