// 代码中会兼容本地 service mock 以及部署站点的静态数据

const async           = require("async");
const fs              = require("fs");
const bcrypt          = require("bcryptjs");
const jwt             = require('jsonwebtoken');
const models          = require('../settings');
const Uuid            = require("cassandra-driver").types.Uuid;
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8'); 
const express =require("express");

function updateRule(req,res){
    const { body } = req;
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
       return  res.send({status: 'expired'}); 
    }
    if(legit.rule !='superadmin'){
                return res.send({status: 'auth_fail'})
    }
    let queries=[];
    async.series([
        function(callback){
            
            callback(null,null);
        },
        function(callback){
            const users_object=()=>{
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.login(object);
                let save        =instance.save({return_query: true});
                return save;
                
            } 
            queries.push(users_object());
            callback(null,null);
        }    
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        try{
             models.doBatch(queries,function(err){
                if(err) return res.send({status: 'error'});
                return res.send({status: "ok"});
            });
        }catch(e){
            return;
        }
       
        
    })
}
function updateRole(req,res){
    const { body } = req;
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
       return  res.send({status: 'expired'}); 
    }
    if(legit.rule !='superadmin'){
                return res.send({status: 'auth_fail'})
    }
    async.series([
        function(callback){
             const users=()=>{
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.users(object);
                let save        =instance.save({return_query: true});
                return save;
                
            } 
             queries.push(users());
            callback(null,null);
        },
        function(callback){
            
            callback(null,null);
        }    
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        return res.send({status: "ok"});
    })
}
function users(req,res){
     const { body } = req;
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
       return  res.send({status: 'expired'}); 
    }
    
    if(legit.rule =='superadmin' || legit.rule =='admin' ){
    }else{
        return res.send({status: 'auth_fail'})
    }
    let users=[];
    async.series([ 
        function(callback){
            models.instance.users.find({},function(err,items){
                users=(items)? items : [];
                callback(err,null);
            })
        },
        function(callback){
            
            callback(null,null);
        }    
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        return res.send({status: "ok",users});
    })
}

function checkAccount(req,res){
    let { username }=req.body;
    let PARAM_IS_VALID={};
    let status='ok';
    async.series([
        function(callback){
            callback(null,null);
        },
        function(callback){
            models.instance.login.find({username:username},function(err,_user){
                
                if(_user && _user.length > 0){
                    status='invalid';
                }
                callback(err,null);
            });
            
        }
    ],function(err,result){
        if(err) res.send({status:'error',username:username});
        else res.send({status:status,username:username});
    });
    
}
var router = express.Router();
router.get('/add_rule',updateRule)
router.put('/',users)
router.put('/check_account',checkAccount)

module.exports = router;
/*
export default {
    
  'GET /api/currentUser': getCurrentUser,
  // GET POST 可省略
  'GET /api/users': users,
  'POST /api/login/account': login,
  'POST /api/register': register,
  'PUT /api/user/add_rule': updateRule ,
    
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};*/
