// 代码中会兼容本地 service mock 以及部署站点的静态数据

const async           = require("async");
const fs              = require("fs");
const bcrypt          = require("bcryptjs");
const jwt             = require('jsonwebtoken');
const models          = require('../settings');
const Uuid            = require("cassandra-driver").types.Uuid;
const config          = require('../ssl/jwtconfig');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8'); 
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
function getCurrentUser(req,res){
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var user={};
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({
        name: "Đăng nhập lại",   
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        country: 'China',
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
        }); 
    }
     async.series([
         function(callback){
            models.instance.users.find({user_id: models.uuidFromString(legit.user_id) },function(err,items){
                if(items){
                    user=items;
                }
                callback(err,null)
            })
            
         },
     ],function(err,result){
         let name='';
         let username='';
        try{
            name=user[0].name;
            username=user[0].username;
        } catch(e){
            
        }
        if(err) res.send({status: 'error'})  
        res.send({
        name: name,
        username:username,    
        avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
        userid: '00000001',
        email: 'antdesign@alipay.com',
        signature: '海纳百川，有容乃大',
        title: '交互专家',
        group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
        tags: [
          {
            key: '0',
            label: '很有想法的',
          },
          {
            key: '1',
            label: '专注设计',
          },
          {
            key: '2',
            label: '辣~',
          },
          {
            key: '3',
            label: '大长腿',
          },
          {
            key: '4',
            label: '川妹子',
          },
          {
            key: '5',
            label: '海纳百川',
          },
        ],
        notifyCount: 12,
        country: 'China',
        geographic: {
          province: {
            label: '浙江省',
            key: '330000',
          },
          city: {
            label: '杭州市',
            key: '330100',
          },
        },
        address: '西湖区工专路 77 号',
        phone: '0752-268888888',
        })   
     })
    
    
  
}
export default {
    
  'GET /api/currentUser': getCurrentUser,
  // GET POST 可省略
  'GET /api/users': users,
  'POST /api/login/account': (req, res) => {
    var privateKEY  = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');
     
    const { password, userName, type } = req.body;
    
    var PARAM_IS_VALID={};
    var user={};
    var hashPassword="";
    var msg="";
    let token=null,auth=false;
    async.series([
        function(callback){
            PARAM_IS_VALID["username"]=userName;
            PARAM_IS_VALID["password"]=password;
            
            callback(null,null);
        },
        function(callback){
            models.instance.login.find({username:PARAM_IS_VALID.username},function(err,_user){
                if(_user != undefined && _user.length > 0 ) {
                    hashPassword=_user[0].password;
                    user['user_id']=_user[0].user_id;
                    user['rule']=_user[0].rule;
                }else{
                    msg='';
                }
                callback(err,null);
            });
        },
        function(callback){
            if(hashPassword !=""){
                bcrypt.compare(PARAM_IS_VALID["password"], hashPassword, function(err, res) {
                    // res == true
                    auth=res;
                    (!res) ? msg='Not match': "" ;
                    callback(err,null);
                });
            }else callback(null,null);
        },
        function(callback){
            if(auth){
               models.instance.users.update({user_id:user.user_id},{last_login:new Date()},{ttl: 86400, if_exists: true},function(err){
                   callback(err,null);  
               });
            }else{
                callback(null,null)
            }   
        },
        function(callback){
            if(auth){
                token = jwt.sign({ user_id: user.user_id,username:userName,rule: user.rule}, privateKEY, {
                  expiresIn: '30d', // expires in 24 hours
                  algorithm: "RS256",
                  subject: userName, 
                });
            }
            callback(null,null);
        }
    ],function(err,result){
        if(auth){
            res.send({
                status: 'ok',
                type,
                currentAuthority: {auth: auth,token: token,rule:user.rule},
            });
        }
        else{
            res.send({
              status: 'error',
              type,
              currentAuthority: 'guest',
            });
        }
        
      return;
    })
    /*
    if (password === '888888' && userName === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin',
      });
      return;
    }  
    if (password === '123456' && userName === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user',
      });
      return;
    }
    
    
      
    
    */
  },
  'POST /api/register': (req, res) => {
    
    let user_id=Uuid.random();
    var params=req.body;
    var queries=[],msg=[];
    let saltRounds=10;
    var _salt="",_hash="";
    var PARAM_IS_VALID={},user={};
    var privateKEY  = fs.readFileSync('./ssl/jwtprivate.pem', 'utf8');  
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID["username"]      = params.username;
                PARAM_IS_VALID['user_id']       = user_id;
                PARAM_IS_VALID["password"]      = params.password;
                PARAM_IS_VALID["phone"]         = params.phone;
                PARAM_IS_VALID["email"]         = params.email;
                PARAM_IS_VALID["address"]       = params.address;
                PARAM_IS_VALID["name"]          = params.name;
                PARAM_IS_VALID["createat"]      = new Date();
                PARAM_IS_VALID["updateat"]      = new Date();
                PARAM_IS_VALID["rule"]          = params.rule;
                user={
                    user_id: PARAM_IS_VALID['user_id'],

                }
            }catch(e){
                return res.send({status:'error'})
            }
            
            callback(null,null);
        },
        function(callback){
            bcrypt.genSalt(saltRounds,  function(err,salt){
                _salt=salt
                callback(err,null);
            });
        },
        function(callback){
            bcrypt.hash(params.password, _salt,   function(err,hash){
                _hash=hash;
                callback(err,null);
            });
        },
        function(callback){

            var user_login_object={
                username                   : PARAM_IS_VALID.username,
                enabled                 : true,
                password                : _hash,
                password_hash_algorithm : "bcrypt",
                password_salt           :_salt,
                user_id                 : PARAM_IS_VALID.user_id,
                rule                    : PARAM_IS_VALID.rule,
            }
            const login=()=>{
                let object      =user_login_object;
                let instance    =new models.instance.login(object);
                let save        =instance.save({return_query: true});
                return save;
            }
            
            queries.push(login());
            let user={
                user_id : PARAM_IS_VALID.user_id,
                username: PARAM_IS_VALID.username,
                phone: PARAM_IS_VALID.phone,
                email: PARAM_IS_VALID.email,
                address: PARAM_IS_VALID.address,
                name: PARAM_IS_VALID.name,
                createAt: PARAM_IS_VALID.createAt,
                updateAt: PARAM_IS_VALID.updateAt,
            }
            const users=()=>{
                let object      =user;
                let instance    =new models.instance.users(object);
                let save        =instance.save({return_query: true});
                return save;
            }
            queries.push(users());
            callback(null,null);
            // Batch Query
        }
    ],function(err,result){
        console.log(err);
        if(err) return res.send({status: 'error'});
       // console.log(queries);
        models.doBatch(queries,function(err){
            user['username']=PARAM_IS_VALID.username;
            //console.log(queries);
            console.log(err)
            if(err) return res.send({status: 'error'});
            let token = jwt.sign({ user_id:PARAM_IS_VALID.user_id ,username:PARAM_IS_VALID.username,rule: PARAM_IS_VALID.rule}, privateKEY, {
                  expiresIn: '30d', // expires in 30 day
                  algorithm: "RS256",
                  subject: PARAM_IS_VALID.email, 
            });
            res.send({ status: 'ok',currentAuthority: {token: token,auth: true,rule:PARAM_IS_VALID.rule}});
        });
    })  
  },
    
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
};
