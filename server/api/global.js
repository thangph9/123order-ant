const models    = require('../settings');
const utils    = require('./utils');
const async     = require("async");
const bcrypt          = require("bcryptjs");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var multer  = require('multer');
var sizeOf = require('image-size');
const  moment = require('moment');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
const upload          = multer();
var express=require("express");
function uploadFile(req,res){
    let dimensions='';
    let isValid=true;
    upload.single('file')(req,res,function(err){
       if (err) return res.send({status: 'error'});
       let imageid= Uuid.random();
       try{
           let file =req.file;
           let image=file.buffer;
           let options={
               filename : file.originalname,
               size     : file.size+"",
               encoding : file.encoding,
               mimetype : file.mimetype,
            };
            var image_object={
               imageid             : imageid,
               image               : image,
               options             : options,
               createat            : new Date(),
            }
            dimensions = sizeOf(image);
           if(dimensions.height > 1000 && dimensions.width > 1000 ){
               let object   =image_object;
               let instance =new models.instance.images(object);
               let save     =instance.save(function(err){
              });
           }else{
               isValid=false;
           }
            
       }catch(e){
           return res.send({status:'error'})
       }
       res.send({status:'ok',file:{imageid,isValid}})
   })
}
function uploadFileThumb(req,res){
    let dimensions='';
    let isValid=true;
    upload.single('file')(req,res,function(err){
       if (err) return res.send({status: 'error'});
       let imageid= Uuid.random();
       try{
           let file =req.file;
           let image=file.buffer;
           let options={
               filename : file.originalname,
               size     : file.size+"",
               encoding : file.encoding,
               mimetype : file.mimetype,
            };
            var image_object={
               imageid             : imageid,
               image               : image,
               options             : options,
               createat            : new Date(),
            }
            dimensions = sizeOf(image);
           if(dimensions.height > 320 && dimensions.width > 740 ){
               let object   =image_object;
               let instance =new models.instance.images(object);
               let save     =instance.save(function(err){
              });
           }else{
               isValid=false;
           }
            
       }catch(e){
           return res.send({status:'error'})
       }
       res.send({status:'ok',file:{imageid,isValid}})
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
function login(req,res){
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
}
function register(req,res){
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
}
function getCurrencyRaito(req,res){
    let raito={};
    async.series([
       function(callback){
            callback(null,null);    
       },
       function(callback){
           models.instance.currency_raito.find({},function(err,items){
               if(items){
                   raito=items;
               }
               callback(err,null);
           });
       }
    ],function(err,result){
        if(err) return res.send('error');
        res.send({raito:raito});
    });
}
function saveCurrencyRaito(req,res){
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
    let listRole=[]
    
    let PARAM_IS_VALID={},queries=[];
    async.series([
        function(callback){
           let uuid='';
           try{
               uuid=models.uuidFromString(legit.user_id);
           }catch(e){
               return res.send({status:"error_auth"})
           }
           models.instance.users.find({user_id:uuid},{select:['role']},function(err,user){
               
               listRole=(user) ? user[0].role : [];
               callback(null,null);
           })
       }, 
        function(callback){
            try{
                if(listRole.indexOf('update_currency_raito') > -1){
                    
                }else{
                    return res.send({status:'error_rule_update_currency_raito'})
                }
            }catch(e){
                return res.send({status:'error_rule_update_currency_raito'})
            }
            
          callback(null,null);  
        },
        function(callback){
            PARAM_IS_VALID['currency']=(req.body.currency) ? req.body.currency : '';
            PARAM_IS_VALID['raito'] = (req.body.raito) ? parseFloat(req.body.raito) : 0;
            
            if(PARAM_IS_VALID['currency'] == '' || PARAM_IS_VALID['raito'] ==0 ){
                return res.send({status: 'invalid'}); 
            }
            callback(null,null);
        },
        function(callback){
            const currency_raito=()=>{
                
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.currency_raito(object);
                let save        =instance.save({return_query: true});
                return save;
            }
           queries.push(currency_raito());
            const currency_raito_by_date=()=>{
                
                let object      =PARAM_IS_VALID;
                object['username']  =legit.username;
                object['date']  =new Date();
                
                let instance    =new models.instance.currency_raito_by_date(object);
                let save        =instance.save({return_query: true});
                return save;
                
            } 
           queries.push(currency_raito_by_date());
           callback(null,null);
        },
    ],function(err,result){
           if(err) return res.send({status: 'error'});
            models.doBatch(queries,function(err){
                
                if(err) return res.send({status: 'error'});
                res.send({ status: 'ok'});
            });
    });
}
function generateOrderBillCode(req,res){
    let bill_code,billCode;
    let id=Uuid.random();
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
    async.series([
        function(callback){
            models.instance.order_by_bill_code.find({types: req.query.type},{raw:true, allow_filtering: true},function(err,r){
                bill_code=r;
                callback(err,null);
            })
            
        },
        function(callback){
            let types,code,idBill,_code;
            
            if(bill_code && bill_code.length > 0){
                idBill=bill_code[0].id;
                _code=parseInt(bill_code[0].bill_code)+1;
            }else{
                idBill=id;
                _code=1;
            }
            code=models.datatypes.Long.fromInt(1);
            models.instance.order_by_bill_code.update({id:idBill,types:'KL'}, {bill_code: code}, function(err){
                    callback(err,null);
            });
            billCode=_code;
        }
        
    ],function(err,result){
        if(err) return res.send({status:'error'});
        res.send({billcode:billCode})
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
function saveComment(req,res){
    let PARAMS_IS_VALID={};
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
    let listRole=[];
    let queries=[];
    async.series([
        function(callback){
            try{
                PARAMS_IS_VALID['commentid']=(body.commentid) ?  models.uuidFromString(legit.user_id) : Uuid.random();
                PARAMS_IS_VALID['comment']=body.scomment;
                PARAMS_IS_VALID['username']=legit.username;
                PARAMS_IS_VALID['sbill_code']=body.sbill_code;
                PARAMS_IS_VALID['createat']=new Date();
            }catch(e){
                return res.send({status: 'error'})
            }
            callback(null,null);
        },
        function(callback){
            const comments_by_user=()=>{
                let object=PARAMS_IS_VALID;
                let comment=new models.instance.comments_by_user(object);
                let save   =comment.save({return_query: true});
                return save;
            }
            queries.push(comments_by_user())
            const comment_by_user=()=>{
                let object={};
                 object['username']=PARAMS_IS_VALID.username;
                 object['sbill_code']=PARAMS_IS_VALID.sbill_code;
                 object['comment']=PARAMS_IS_VALID.comment;
                 object['createat']=PARAMS_IS_VALID.createat;
                let comment=new models.instance.comment_by_user(object);
                let save   =comment.save({return_query: true});
                return save;
            }
            
            queries.push(comment_by_user())
            const update_orders_comment=()=>{
                var query_object = {sbill_code: PARAMS_IS_VALID.sbill_code};
                var update_values_object = {scomment: PARAMS_IS_VALID.comment};
                var options = {ttl: 86400, return_query: true};
                var orders= models.instance.orders.update(query_object,update_values_object,options);
                return orders;
            }
            queries.push(update_orders_comment())
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status:"error"})
        try{
             models.doBatch(queries,function(err){
                if(err) return res.send({status: 'error_03'});
                res.send({status: "ok",result:PARAMS_IS_VALID })
            });
         }catch(e){
             return res.send({status: 'error_04'});
         }
    });
}
function getComment(req,res){
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
    const params=req.query; 
    let listRole=[];
    let queries=[];
    let list=[];
    let PARAMS_IS_VALID={}
    async.series([
        function(callback){
            try{
                PARAMS_IS_VALID['sbill_code']=params.sbill_code;
            }catch(e){
            return res.send({status: 'error'})
            }
            callback(null,null);
        },
        function(callback){
            callback(null,null);
        },
        function(callback){
            var query={$solr_query: '{"q":" sbill_code:'+PARAMS_IS_VALID.sbill_code+'"}'}
            
            models.instance.comment_by_user.find(query,function(err,items){
               if(items){
                   list=items;
               }
               callback(err,null);
           });
        }
    ],function(err,result){
        if(err) return res.send({status:"error"})
        res.send({status : 'ok',list: list})
    });
    
}
router.post("/upload",uploadFile);
router.post("/upload/thumb",uploadFileThumb);
router.post("/login/account",login);
router.post("/register",register);
router.get("/currentUser",getCurrentUser);
router.get("/currency/raito",getCurrencyRaito);
router.get("/generate/bill_code",generateOrderBillCode);
router.post("/currency/raito",saveCurrencyRaito);
router.post("/comment/save",saveComment);
router.get("/comment/list",getComment);
router.get("/500",(req,res)=>{
      res.status(500).send({
      timestamp: new Date().getTime(),
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });     
})
router.get("/404",(req,res)=>{
      res.status(404).send({
      timestamp: new Date().getTime(),
      status: 404,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });     
})
router.get("/403",(req,res)=>{
      res.status(403).send({
      timestamp: new Date().getTime(),
      status: 403,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });     
})
router.get("/401",(req,res)=>{
      res.status(401).send({
      timestamp: new Date().getTime(),
      status: 401,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });     
})
module.exports = router;
/*
export default {
  'GET /api/product/list'   : getProducts,
  'GET /api/product/DT'   : getDetail,
    
  'POST /api/product/search': searchProducts,    
  'POST /api/product/save'  : saveProduct,
  'POST /api/upload'    : uploadFile ,
  'POST /api/upload/thumb'    : uploadFileThumb ,
  'POST /api/product/publish'   : publish,
  'POST /api/product/unpublish' : unpublish,
  'GET /api/product/image/:imageid': image ,
};
*/