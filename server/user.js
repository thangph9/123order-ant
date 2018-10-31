const async           = require("async");
const fs              = require("fs");
const bcrypt          = require("bcryptjs");
const jwt             = require('jsonwebtoken');
const models          = require('../settings');
const Uuid            = require("cassandra-driver").types.Uuid;
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');
var express     = require('express')
var router = express.Router();
router.post('/forms',(req, res) => {
    res.send({ message: 'Ok' });
  });