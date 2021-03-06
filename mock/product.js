import mockjs from 'mockjs';
const models    = require('../settings');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var multer  = require('multer');
var sizeOf = require('image-size');
import moment from 'moment';
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
            status: 'ok',   
            list:products,
            pagination:{total: products.length, pageSize: pageSize, current: current}})
    })
}
function saveProductVariants(req,res){
    let PARAM_IS_VALID={};
    let params=req.body;
    var queries = [];
    async.series([
        function(callback){
            try{
                let r = Math.random().toString(36).substring(7);
                //console.log("Params", params);
                
                if(params.productid){
                    PARAM_IS_VALID['productid']=models.uuidFromString(params.productid); 
                }
                PARAM_IS_VALID['name']=params.name;
                PARAM_IS_VALID['currency']=params.currency;
                PARAM_IS_VALID['nodeid']=params.nodeid;
                PARAM_IS_VALID['price']=(params.price) ? parseFloat(params.price) : 0;
                PARAM_IS_VALID['sale']=(params.sale) ? parseInt(params.sale) : 0;
                PARAM_IS_VALID['sale_price']=(params.sale_price) ? parseFloat(params.sale_price) : 0;
                PARAM_IS_VALID['variants'] = params.variants;
                PARAM_IS_VALID['images']= params.images;
                PARAM_IS_VALID['thumbnail']= params.thumbnail;
                PARAM_IS_VALID['colors']=params.colors;
                PARAM_IS_VALID['styles']=params.styles;
                PARAM_IS_VALID['sizes']=params.sizes;
                PARAM_IS_VALID['size_type']=params.size_type;
                PARAM_IS_VALID['amount']=(params.amount) ? parseInt(params.amount) : 0;
                PARAM_IS_VALID['productid']=Uuid.random();
                PARAM_IS_VALID['lname']= decodeVI(PARAM_IS_VALID.name);
            }catch(e){
                return res.send({status: 'error_01'})
            }
                
            callback(null,null)
        },
        function(callback){
            
            let colors   =[];
            let sizes   =[];
            let styles   =[];
            let object={};
            object.colors=PARAM_IS_VALID['colors'];
            object.sizes=PARAM_IS_VALID['sizes'];
            PARAM_IS_VALID['attrs'] = object;
            callback(null,null);
        },
        function(callback){
            try{
                let object={};
                object.productid=PARAM_IS_VALID.productid;
                object.name=PARAM_IS_VALID.name;
                object.currency=PARAM_IS_VALID.currency;
                object.lname=PARAM_IS_VALID.lname;
                object.style=PARAM_IS_VALID.style;
                object.attrs=PARAM_IS_VALID.attrs;
                object.description=PARAM_IS_VALID.description;
                object.infomation=PARAM_IS_VALID.infomation;
                object.material=PARAM_IS_VALID.material;
                object.images=PARAM_IS_VALID.images;
                object.thumbnail=PARAM_IS_VALID.thumbnail;
                object.category=(PARAM_IS_VALID.nodeid[0]) ? PARAM_IS_VALID.nodeid[0] : '';
                object.department=PARAM_IS_VALID.department;
                object.brand=PARAM_IS_VALID.brand;
                object.type=PARAM_IS_VALID.type;
                object.createat=new Date();
                var p=new models.instance.dev_products(object);
                var save=p.save({if_not_exist:true},function(err){
                    callback(err,null);
                });
            }catch(e){
                console.log(e);
                return res.send({status: 'error'})
            }  
        },
        function(callback){
            try{
                let renderItem=[];
                let object=PARAM_IS_VALID;
                
                
                PARAM_IS_VALID.productid=object.productid;
                if(object.variants && object.variants.length > 0 ){
                        object.variants.map((e,i)=>{
                            let _object={};
                            let today=new Date().getTime();
                            let r=Math.random().toString(32).substring(2,4);
                            let u=(today+i).toString(32).substring(2);
                            
                            _object.variantionsid=(r+u).toUpperCase();
                            _object.productid=object.productid;
                            _object.stock=object.stock;
                            _object.name=object.name;
                            _object.lname=object.lname;
                            _object.thumbnail=(e.thumbnail) ? e.thumbnail : object.thumbnail;
                            _object.sale={
                                saleOff: object.sale+"",
                                salePrice: object.sale_price+"",
                                saleDate: object.sale_date+""
                            };
                            _object.attrs=e;
                            if(e.images) _object.images=e.images;
                            else _object.images=object.images;

                            if(e.price) _object.price=e.price;
                            else _object.price=object.price;

                            if(e.amount) _object.amount=e.amount;
                            else _object.amount=object.amount;
                            queries.push(_object);
                    });/*
                    renderItem.map((e,i)=>{
                        
                        
                        var product=new models.instance.test_products(_object);
                        var save=product.save({if_not_exist:true},function(err){
                            console.log(err); 

                        });
                    });
                    */
                    callback(null,null);
                }else{
                    queries.push(object);
                    callback(null,null);
                    /*
                    var product=new models.instance.test_products(object);
                    var save=product.save({if_not_exist:true},function(err){
                        callback(err,null);
                        
                    });*/
                }
            }catch(e){
                return res.send({status: 'error_02'})
            }
        },
        function(callback){
            queries.map(e=>{
                var variants=new models.instance.variantions(e);
                var save=variants.save({if_not_exist:true},function(err){
                    console.log(err);
                });
            })
            callback(null,null);  
        },
        function(callback){
            callback(null,null)
        }
    ],function(err,result){
        console.log(err);
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok'})
    });
}
function syncSave(data,callback){
    
    callback(null,null);
}
function getProductByCategory(req,res){
    let products=[];
    let temp=[];
    let pageSize=(req.query.pageSize) ? req.query.pageSize : 10;
    let current=(req.query.current) ?  req.query.pageSize : 1; 
    let start=( current > 1 ) ? current*pageSize : 0;
    async.series([
        function(callback){
            models.instance.products_by_category.find({},{ },function(err,items){
                
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
            status: 'ok',    
            list:products,
            pagination:{total: products.length, pageSize: pageSize, current: current}})
    })
}
function getProductByID(req,res){
    let products=[];
    let temp=[];
    let pageSize=(req.query.pageSize) ? req.query.pageSize : 10;
    let current=(req.query.current) ?  req.query.pageSize : 1; 
    let start=( current > 1 ) ? current*pageSize : 0;
    async.series([
        function(callback){
            models.instance.products_by_category.find({productid: models.uuidFromString('644eb53d-f6db-4ea4-87f9-cb17e14490f5')},function(err,items){
                
                products=(items) ? items[0] : [];
                
                callback(err,null)
            })
            
        }
    ],function(err,result){
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            status: 'ok',    
            data:products})
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
            }catch (e){
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
function updateProduct(req,res){
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
                PARAM_IS_VALID['seo_link']=params.seo_link;
                PARAM_IS_VALID['amount'] =(params.amount) ? parseInt(params.amount) : 0;
                PARAM_IS_VALID['asin']= (params.asin) ? params.asin : null;
                PARAM_IS_VALID['brand']= (params.brand) ? params.brand : null;
                PARAM_IS_VALID['color']= (params.color) ? params.color : null;
                PARAM_IS_VALID['style']= (params.style) ? params.style : null;
            }catch (e){
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            try{
                let object=PARAM_IS_VALID;
                var query_object = {productid:object.productid};
                var update_values_object = {title: object.title,
                                            thumbnail: object.thumbnail,
                                            amount:object.amount,
                                            asin: object.asin,
                                            brand: object.brand,
                                            color:object.color,
                                            currency:object.currency,
                                            death_clock:object.death_clock,
                                            desc_detail:object.desc_detail,
                                            description: object.description,
                                            image_huge: object.image_huge,
                                            image_large:object.image_large,
                                            image_small:object.image_small,
                                            meta: object.meta,
                                            meta_description:object.meta_description,
                                            nodeid: object.nodeid,
                                            price: object.price,
                                            sale:object.sale,
                                            sale_price: object.sale_price,
                                            seller:object.seller,
                                            seo_link:object.seo_link,
                                            size:object.size,
                                            size_desc: object.size_desc,
                                            style:object.style,
                                            materials_use:object.materials_use,
                                            manufacturer:object.manufacturer
                                        };
                var options = {if_exists: true};
                models.instance.product_detail.update(query_object, update_values_object, options,function(err){
                        console.log(err);
                    });
            }catch(e){
                return res.send({status: 'error_02'})
            }
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status: 'error_03'});
        try{
             models.doBatch(queries,function(err){
                if(err) return res.send({status: 'error_04'});
                return res.send({ status: 'ok'});
            });
         }catch(e){
             return res.send({status: 'error_05'});
         }
    })
}
// add ver2 with product variants
function add(req,res){
    var queries=[];
    var params=req.body;
    var products={};
    var queryOption=[];
    var queryCategories=[];
    
    async.series([
        function(callback){
          try{
              products={
                    productid: Uuid.random(),
                    name: params.name,
                    lname: params.lname,
                    nodeid: params.nodeid,
                    images: [],
                    thumbnail: '',
                    price: params.price,
                    amount: params.amount,
                    type: params.type,
                    brand: params.brand,
                    currency: params.currency,
                    seller: params.seller,
                    manufacturer: params.manufacturer,
                    size_type: params.size_type,
                    seo_meta: params.seo_meta,
                    sale:{
                        saleOff: params.sale+"",
                        salePrice: params.sale_price+"",
                        saleDate: new Date().toString()
                    },
                    variants:params.variants,
                    options:params.options,
                    descriptions: {
                        desc: params.description,
                        material: params.materials_use,
                        size_desc: params.size_desc,
                        desc_detail: params.desc_detail,
                    },
                    thumbnail: params.thumbnail
              }
          }catch(e){
              
          }
          callback(null,null);  
        },
        function(callback){
            callback(null,null)
        }, // xử lý thêm sp vào product_by_categories
        function(callback){
            if(Array.isArray(products.nodeid)){
                try{
                    products.nodeid.map((e,index)=>{
                      var globalCounter={};
                      var globalUpdate=0;    
                      async.series([
                          function(cb){
                            models.instance.counterGlobal.find({id: models.uuidFromString(e)},function(err,item){
                                if(item && item.length > 0){
                                    globalCounter=item[0];
                                }else{
                                    globalCounter=0;
                                }
                                cb(err,null);
                            }) 
                          },
                          function(cb){
                              var counter= parseInt(globalCounter.product_by_categories) + 1;
                              let product_by_categories=()=>{
                                   var object={
                                        productid: products.productid,
                                        catid: models.uuidFromString(e),
                                        name: products.name,
                                        orderby: counter || 1,
                                        groupby: '',
                                  };
                                   console.log(object);
                                  var instance=new models.instance.product_by_categories(object);
                                  var query=instance.save({return_query: true});
                                  return query;
                               }
                              queryCategories.push(product_by_categories());
                              cb(null,null);
                          },
                          function(cb){
                              try{
                                        var query_object = {id: models.uuidFromString(e)};
                                        var update_values_object = {product_by_categories: models.datatypes.Long.fromInt(1)};
                                        models.instance.counterGlobal.update(query_object, update_values_object,function(err){
                                                console.log(err);
                                            }); 

                                }catch(e){

                                }
                              cb(null,null);
                          }
                      ],function(err,resut){
                          try{
                              models.doBatch(queryCategories, function(err){
                                 console.log(err);
                              });
                          }catch(e){
                              
                          }
                      })
                    });
                   
                }catch(e){
                    console.log(e);
                }
                   
            }
            callback(null,null);
        },
        //variant _by_product
        function(callback){
          if(products.variants && products.variants.length > 0 ){    
              products.variants.map(e=>{
                  let variant_by_product=()=>{
                      var object={
                            productid: products.productid,
                            variantid: e._id,
                            name: e.name,
                            value: e.values,
                            orderby: e.orderby,
                            creatat: new Date(),
                      };
                      var instance=new models.instance.variant_by_product(object);
                      var query=instance.save({return_query: true});
                      return query;
                  }
                  queries.push(variant_by_product());
              }) 
          }
          callback(null,null); 
              
        },
        // product options
        function(callback){
            try{
               if(Array.isArray(products.options)){ 
                   products.options.map(e=>{
                    var optid=Uuid.random();
                    var attrs={};
                    if(Array.isArray(products.options)){ 
                        products.variants.map(k=>{
                            attrs[k._id]=e[k._id];
                        });
                        let options=()=>{
                              var object={
                                    optid: optid,
                                    productid:products.productid,
                                    price: e.price,
                                    amount: e.amount,
                                    attrs: attrs,
                                    images: e.images
                              };
                              var instance=new models.instance.options(object)
                              var query=instance.save({return_query: true});
                              return query;
                          }
                          queryOption.push(options());
                    }
                });
                   
              }else{
                  var optid=Uuid.random();
                 let options=()=>{
                              var object={
                                    optid: optid,
                                    productid:products.productid,
                                    price: products.price,
                                    amount: products.amount
                              };
                              var instance=new models.instance.options(object)
                              var query=instance.save({return_query: true});
                              return query;
                          }
                          queryOption.push(options()); 
              }
            }catch(e){
                console.log(e);
            }
            callback(null,null); 
        },
        // product
        function(callback){
            try{
                let product=()=>{
                      var object={
                            productid: products.productid,
                            price: products.price,
                            sale: products.sale,
                            descriptions: products.descriptions,
                            images: products.images,
                            thumbnail: products.thumbnail,
                            brand: products.brand,
                            style: products.style,
                            type: products.type,
                            name : products.name,
                            lname: products.lname,
                            brand: products.brand,
                            seller: products.seller,
                            amount: products.amount,
                            nodeid: products.nodeid,
                            manufacturer: products.manufacturer,
                            size_type: products.size_type,
                            currency: products.currency,
                            
                      };
                      var instance=new models.instance.product(object);
                      var query=instance.save({return_query: true});
                      return query;
                  }
                queries.push(product());
            }catch(e){
                console.log(e);
            }
            callback(null,null)
        },
        
        function(callback){
            models.doBatch(queries, function(err){
                callback(err,null);
            });
        },
        function(callback){
            models.doBatch(queryOption, function(err){
                callback(err,null);
            });
        },
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        else res.send({status: 'ok',product: products})
    })
}
function listProductV2(req,res){
    var params=req.params;
    var productid=req.params.productid;
    var product={};
    async.series([
        function(callback){
            try{
                productid=models.uuidFromString(productid);
            }catch(e){
                
            }
            callback(null,null);
        },
        function(callback){
            models.instance.product.find({productid},function(err,item){
                 if(item && item.length > 0){
                     product=item[0];
                 }
                 callback(err,null);
            });
            
        },
        function(callback){
            
            callback(null,null)
        }
    ],function(err, results){
        res.send({status: 'ok',data: product});
    })
}
function listVariantV2(req,res){
    var params=req.params;
    var productid=req.params.productid;
    var variants={};
    async.series([
        function(callback){
            try{
                productid=models.uuidFromString(productid);
            }catch(e){
                
            }
            callback(null,null);
        },
        function(callback){
            models.instance.variant_by_product.find({productid},function(err,item){
                 if(item && item.length > 0){
                     variants=item;
                 }
                 callback(err,null);
            });
            
        },
        function(callback){
            
            callback(null,null)
        }
    ],function(err, results){
        res.send({status: 'ok',data: variants});
    })
}
function listOptionsV2(req,res){
    var params=req.params;
    var productid=req.params.productid;
    var options={};
    async.series([
        function(callback){
            try{
                productid=models.uuidFromString(productid);
            }catch(e){
                
            }
            callback(null,null);
        },
        function(callback){
            models.instance.options.find({productid},function(err,item){
                 if(item && item.length > 0){
                     options=item;
                 }
                 callback(err,null);
            });
            
        },
        function(callback){
            
            callback(null,null)
        }
    ],function(err, results){
        res.send({status: 'ok',data: options});
    })
}
function addOptionsV2(req,res){
    var params=req.body;
    var option={};
    async.series([
        function(callback){
            try{
                option.productid=models.uuidFromString(params.productid);
                option.optid=Uuid.random();
                option.price=params.price;
                option.amount=params.amount;
                option.attrs=params.attrs;
                option.images=params.images;
                params.optid=option.optid;
            }catch(e){
               return res.send({status: 'error'})
            }
            callback(null,null)
        },function(callback){
            var instance=new models.instance.options(option);
            instance.save(function(err){
                callback(err,null)
            });
        }
    ],function(err,results){
        if(err) return res.send({status: 'error', data: req.body});
        res.send({status: 'ok', data: params});
    });
    
}
function updateOptionsV2(req,res){
    var params=req.body;
    var option={};
    async.series([
        function(callback){
            try{
                option.productid=models.uuidFromString(params.productid);
                option.optid=models.uuidFromString(params.optid);
                option.price=params.price;
                option.amount=params.amount;
                option.attrs=params.attrs;
                option.images=params.images;
            }catch(e){
               return res.send({status: 'error'})
            }
            callback(null,null)
        },function(callback){
            var query_object = {productid: option.productid,optid: option.optid};
            var update_values_object = {
                                            price : option.price,
                                            amount: option.amount,
                                            attrs : option.attrs,
                                            images: option.images,
                                        };
            var options = {if_exists: true};
            models.instance.options.update(query_object, update_values_object, options, function(err){
                 callback(err,null);
            });
           
        }
    ],function(err,results){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok', data: params});
    });
}
function deleteOptionsV2(req,res){
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
    var params=req.params;
    var optid='';
    var productid='';
    async.series([
        function(callback){
            console.log(params);
            try{
                
                optid=models.uuidFromString(params.optid);
                productid=models.uuidFromString(params.productid);
            }catch(e){
                return res.send({status: 'error'})
            }
            callback(null,null);
        },
        function(callback){
            var query_object = {optid,productid};
            models.instance.options.delete(query_object, function(err){
               callback(err,null)
            });

            
        }
    ],function(err,result){
        console.log(err);
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok'})
    })
}
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
           
           if(dimensions.height >= 320 && dimensions.width >= 640 ){
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
function uploadFreeSize(req,res){
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
           
               let object   =image_object;
               let instance =new models.instance.images(object);
               let save     =instance.save(function(err){
              });
            
       }catch(e){
           return res.send({status:'error'})
       }
       res.send({status:'ok',file:{imageid,isValid}})
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
function decodeVI(alias){
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
    str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
    str = str.replace(/đ/g,"d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
    str = str.replace(/ + /g," ");
    str = str.trim(); 
    str=str.replace(/\s+/g, ' ');
    return str;
}
export default {
  'GET /api/product/list'   : getProducts,
  'GET /api/product/DT'   : getDetail,
  'GET /api/product/PL'   : getProductByCategory,
  'GET /api/product/POD'   : getProductByID,
  'GET /api/product/uniqueID'   : (req,res)=>{
        var time=new Date().getTime();
        var uni= time.toString(24).toUpperCase();
        res.send(uni);
  },
  
    
  'POST /api/product/search': searchProducts,    
  'POST /api/product/save'  : saveProduct,
  'PUT /api/product/update'  : updateProduct,
  'POST /api/upload'    : uploadFile ,
  'POST /api/upload/thumb'    : uploadFileThumb ,
  'POST /api/upload/blog'    : uploadFreeSize ,
  'POST /api/product/publish'   : publish,
  'POST /api/product/unpublish' : unpublish,
  'POST /api/product/add' : add, // ver2
  'GET /api/product/image/:imageid': image,
  'PUT /api/product/saveProductVariants'   : saveProductVariants,
  'GET /api/product/v2/:productid'   : listProductV2,
  'GET /api/product/v2/variants/:productid'   : listVariantV2,
  'GET /api/product/v2/options/:productid'   : listOptionsV2,
  'DELETE /api/product/v2/options/delete/:optid/:productid'   : deleteOptionsV2,
  'POST /api/product/v2/options/add'   : addOptionsV2,
  'PUT /api/product/v2/options/update'   : updateOptionsV2,
};
