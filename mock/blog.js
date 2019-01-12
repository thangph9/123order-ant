import mockjs from 'mockjs';
const models    = require('../settings');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
import moment from 'moment';
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
function list(req,res){
    
    var data=[];
    async.series([
        function(callback){
            
            callback(null,null)
        },
        function(callback){
            models.instance.articles.find({},function(err,item){
                data=item;
                callback(err,null)
            });
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',list: data,pagination:{totalPage: 10,current:1 }});
    });
}
function byID(req,res){
     var data=[];
    var PARAM_IS_VALID={};
    var params=req.params;
    console.log(params);
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.artid=models.uuidFromString(params.artid);
                
            }catch(e){
                return res.send({status: 'invalid'});
            }
            callback(null,null)
        },
        function(callback){
            models.instance.articles.find({artid: PARAM_IS_VALID.artid},function(err,item){
                if(item && item.length > 0){
                    data=item[0];
                }
                callback(err,null)
            });
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: data});
    });
}
function detail(req,res){
    var data=[];
    var PARAM_IS_VALID={};
    var params=req.body
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.artid=models.uuidFromString(params.artid);
                
            }catch(e){
                return res.send({status: 'invalid'});
            }
            callback(null,null)
        },
        function(callback){
            models.instance.articles.find({artid: PARAM_IS_VALID.artid},function(err,item){
                data=item;
                callback(err,null)
            });
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: data});
    });
}
function search(req,res){
    var data=[];
    async.series([
        function(callback){
            callback(null,null)
        },
        function(callback){
            callback(null,null)
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',list: data});
    });
}
function save(req,res){
    var data=[];
    var params=req.body;
    var PARAM_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.title=params.title;
                PARAM_IS_VALID.artid=Uuid.random();
                PARAM_IS_VALID.content=params.content;
                PARAM_IS_VALID.image=params.image;
                PARAM_IS_VALID.short_desc=params.short_desc;
                PARAM_IS_VALID.createat=new Date();
                var expired=null;
                if(params.expired) expired= {start: params.expired[0] ,end: params.expired[1]};
                PARAM_IS_VALID.expired=expired;
            }catch(e){
                return res.send({status: 'invalid'});
            }
            callback(null,null)
        },
        function(callback){
            let object=PARAM_IS_VALID;
            var instance=new models.instance.articles(object);
            instance.save({if_not_exist: true},function(err){
                callback(err,null)
            })
            
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: PARAM_IS_VALID});
    });
}
function update(req,res){
    var data=[];
    var params=req.body;
    var PARAM_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.title=params.title;
                PARAM_IS_VALID.artid=models.uuidFromString(params.artid);
                PARAM_IS_VALID.content=params.content;
                PARAM_IS_VALID.image=params.image;
                PARAM_IS_VALID.short_desc=params.short_desc;
                var expired={
                    
                }
                if(params.expired){
                    expired.start=params.expired[0];
                    expired.end=params.expired[1];
                }
                PARAM_IS_VALID.expired=expired;
                
            }catch(e){
                return res.send({status: 'invalid'});
            }
            callback(null,null)
        },
        function(callback){
            let object=PARAM_IS_VALID;
            var query_object = {artid:object.artid};
            var update_values_object = {title: object.title,
                                        content: object.content,
                                        image: object.image,
                                        short_desc:object.short_desc,
                                        expired: object.expired};
            var options = {if_exists: true};
            models.instance.articles.update(query_object, update_values_object, options, function(err){
                callback(err,null);
            });
            
        }
    ],function(err,result){
        console.log(err);
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: PARAM_IS_VALID});
    });
}
function image(req,res){
    let image='';
    let imageid='';
    async.series([
        function(callback){
            try{
                
                let uuid=req.params.imageid;
                imageid=models.uuidFromString(uuid);
            }catch(e){
                res.contentType('image/jpeg');
                return res.end('','binary');
            }
            callback(null,null)
        },
        function(callback){
            models.instance.images.find({imageid: imageid},function(err,img){
                if(img && img.length > 0){
                    image=img[0].image; 
                }
                callback(err,null);
            })
            
        }
    ],function(err,result){
        if(err){
            res.contentType('image/jpeg');
            res.end('','binary');
        }else if(image){
            res.writeHead(200, {'Content-Type': 'image/jpg'});
            res.end(image,'binary');
        }else{
            res.contentType('image/jpeg');
            res.end('','binary');
        }
    })
}
function remove(req,res){
    var data=[];
    var params=req.params.artid;
    var PARAM_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.artid=models.uuidFromString(params);
            }catch(e){
                return res.send({status: 'invalid'})
            }
            callback(null,null)
        },
        function(callback){
            var query_object = {artid: PARAM_IS_VALID.artid};
            models.instance.articles.delete(query_object, function(err){
                callback(err,null);
            });
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',artid: params});
    });
}
export default {
  'GET /api/blog/list'        : list, 
  'GET /api/blog/BY/:artid'        : byID, 
  'GET /api/blog/image/:imageid'      : image, 
  'POST /api/blog/DETAIL'     : detail, 
  'POST /api/blog/SEARCH'     : search, 
  'PUT /api/blog/SAVE'        : save, 
  'PUT /api/blog/UPDATE'      : update, 
  
  'DELETE /api/blog/DELETE/:artid'     : remove, 
};
