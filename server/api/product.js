const express =require("express");
const models    = require('../settings');
const utils    = require('./utils');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var multer  = require('multer');
var sizeOf = require('image-size');
const  moment = require('moment');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
const upload          = multer();

function getDetail(req,res){
    let product=[];
    let PARAMS_IS_VALID={};
    async.series([
        function(callback){
            try{
                
                PARAMS_IS_VALID['productid']=(req.query.productid) ? models.uuidFromString(req.query.productid) : ''
            }catch(e){
                return res.send({status: 'error_invalid'})
            }
            
            callback(null,null)  
        },
        function(callback){
            models.instance.product_detail.find({productid: PARAMS_IS_VALID['productid'] },function(err,items){
                product=(items && items.length > 0) ? items[0] : [];
                callback(err,null)
            })
        }
    ],function(err,result){
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            data    : product,
            status  : 'ok'
        })
    })
}
function getProducts(req,res){
    let products=[];
    let temp=[];
    let pageSize=(req.query.pageSize) ? req.query.pageSize : 10;
    let current=(req.query.current) ?  req.query.pageSize : 1; 
    let start=( current > 1 ) ? current*pageSize : 0;
    async.series([
        function(callback){
            models.instance.product_detail.find({$solr_query: '{"q":"*:*","sort":"createat asc "}'},{select: ['title','death_clock','createby','createat','nodeid','thumbnail','productid'] },function(err,items){
                
                products=(items) ? items : [];
                
                callback(err,null)
            })
            
        },function(callback){
            mappingCategoryProduct(products,function(err,rs){
                products=rs;
                callback(err,null)
            })
            
        }
    ],function(err,result){
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            list:products,
            pagination:{total: products.length, pageSize: pageSize, current: current}})
    })
}
function searchProducts(req,res){
    let products=[];
    let pageSize=(req.query.pageSize) ? req.query.pageSize : 10;
    let current=(req.query.current) ?  req.query.pageSize : 1; 
    let start=( current > 1 ) ? current*pageSize : 0;
    let nodeid='';
    let fulltext='';
    let query='{"q":"*:*","sort":"createat asc "}';
    
    async.series([
        function(callback){
            let tempQuery='';
            nodeid=req.body.nodeid;
            fulltext=req.body.q;
            if(nodeid && nodeid.length > 0){
                tempQuery='nodeid: *'+nodeid+'*';
            }
            if(fulltext && fulltext.length > 0){
                if(tempQuery.length > 0){
                    tempQuery=tempQuery + ' AND title: *'+fulltext+'*';
                }else{
                    tempQuery='title: *'+fulltext+'*';
                }
            }
            if(tempQuery.length > 0){
                query='{"q": "'+tempQuery+'","sort" : "createat asc "}';
            }
            callback(null,null);  
        },
        function(callback){
            
            models.instance.product_detail.find({$solr_query: query},{select: ['title','death_clock','createby','createat','nodeid','thumbnail','productid'] },function(err,items){
                products=(items) ? items : [];
                callback(err,null)
            })
        },
        function(callback){
            mappingCategoryProduct(products,function(err,rs){
                products=rs;
                callback(err,null)
            })
        }
    ],function(err,result){
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            list:products,
            pagination:{total: products.length, pageSize: pageSize, current: current}})
    })
}
function mappingCategoryProduct(result,callback){
    let newRes=[];
    let category=[];
    async.series([
        function(callback){
            models.instance.category.find({},{select: ['title','nodeid']},function(err,items){
                category=(items) ? items : [];
                callback(err,null)
            })
        },
        function(callback){
            result.map(e=>{
                if(e.nodeid && e.nodeid.length > 0){
                    let aa=[];
                    e.nodeid.map(a=>{
                       let aaa=category.filter(f=>{
                            if(a==f.nodeid.toString()){
                                return true;
                            }else{
                                return false;
                            }
                        });
                        aa.push(aaa[0]);
                    });
                    e.category=aa;
                }
                newRes.push(e);
            })
            callback(null,null)
        }
    ],function(err,res){
        callback(err,newRes);
    })
}
function saveProduct(req,res){
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    var PARAM_IS_VALID={};
    let queries=[];
    let params=req.body;
    async.series([
        function(callback){
            //models.instance.
            try{
                
                PARAM_IS_VALID=params;
                if(params.productid){
                    PARAM_IS_VALID['productid']=models.uuidFromString(params.productid); 
                }
                PARAM_IS_VALID['nodeid']=params.nodeid;
                PARAM_IS_VALID['price']=(params.price) ? parseFloat(params.price) : 0;
                PARAM_IS_VALID['sale']=(params.sale) ? parseInt(params.sale) : 0;
                PARAM_IS_VALID['sale_price']=(params.sale_price) ? parseFloat(params.sale_price) : 0;
                let dateClock=(params.death_clock) ? params.death_clock : [];
                
                if(dateClock.length > 0){
                    PARAM_IS_VALID['death_clock']={ start:new Date(dateClock[0]) ,end: new Date(dateClock[1])}
                }else{
                    PARAM_IS_VALID['death_clock']={ }
                }
                
                PARAM_IS_VALID['image_huge']= params.images;
                PARAM_IS_VALID['image_large']= [];
                PARAM_IS_VALID['image_small']= [];
                
                let info={}
                if(params.item_weight){
                    info['item_weight']=params.item_weight;
                }
                if(params.dimensions){
                    info['dimensions']=params.dimensions;
                }
                if(params.asin){
                    info['asin']=params.asin;
                }
                if(params.model_number){
                    info['model_number']=params.model_number;
                }
                if(params.shipping_weight){
                    info['shipping_weight']=params.shipping_weight;
                }
                
                PARAM_IS_VALID['infomation']= info;
                
                PARAM_IS_VALID['seo_link']=params.seo_link;
                console.log(PARAM_IS_VALID);
            }catch (e){
                console.log(e);
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            try{
                const product=()=>{
                    const productid=Uuid.random();
                    let object      =PARAM_IS_VALID;
                    if(PARAM_IS_VALID['productid']){
                        
                    }else{
                        object['productid']   =productid;
                        object['createby']  =legit.username;
                        object['createat']  =new Date();
                    }
                    let instance    =new models.instance.product_detail(object);
                    let save        =instance.save({return_query: true});
                    return save;
                } 
                 queries.push(product());
            }catch(e){
                console.log(e);
                return res.send({status: 'error_02'})
            }
                
           
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status: 'error_03'});
        try{
             models.doBatch(queries,function(err){
                 console.log(err);
                if(err) return res.send({status: 'error_04'});
                return res.send({ status: 'ok'});
            });
         }catch(e){
             return res.send({status: 'error_05'});
         }
    })
}

function deleteProduct(req,res){
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    async.series([
        function(callback){
            callback(null,null)
        },
        function(callback){
            callback(null,null)
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok'})
    })
}
function imageProduct(req,res){
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    async.series([
        function(callback){
            callback(null,null)
        },
        function(callback){
            callback(null,null)
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok'})
    })
}
function publish(req,res){
     var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    async.series([
        function(callback){
            callback(null,null)
        },
        function(callback){
            callback(null,null)
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok'})
    })
}
function unpublish(req,res){
     var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send({status: 'expired'}); 
    }
    res.send({status: 'ok'})
}

router = express.Router();
router.get('/list',getProducts);
router.get('/DT',getDetail);
router.post('/search',searchProducts);
router.post('/save',saveProduct);
router.post('/publish',publish);
router.post('/unpublish',unpublish);
router.get('/image/:imageid',utils.image);
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
