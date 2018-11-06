var express     = require('express')
var moment      = require('moment');
const jwt       = require('jsonwebtoken');
const fs        = require('fs');
const async           = require("async");
const bcrypt          = require("bcryptjs");
const Uuid            = require("cassandra-driver").types.Uuid;
const models          = require("../settings");

var multer  = require('multer');
var upload = multer({ dest: 'uploads/' })
var currencyFormatter = require('currency-formatter');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
var router = express.Router()
router.post('/',function(req,res,next){
    
})
module.exports = router