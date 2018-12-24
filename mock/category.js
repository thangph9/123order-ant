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

function save(req,res){
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
            //console.log(params);
            try{
                PARAM_IS_VALID=params;
                if(params.nodeid){
                    PARAM_IS_VALID['nodeid']=models.uuidFromString(params.nodeid);
                }
                let dateClock=(params.death_clock) ? params.death_clock : [];
                
                if(dateClock.length > 0){
                    PARAM_IS_VALID['death_clock']={ start:new Date(dateClock[0]) ,end: new Date(dateClock[1])}
                }else{
                    PARAM_IS_VALID['death_clock']={ }
                }
                
                
            }catch (e){
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            try{
                const category=()=>{
                    let object=PARAM_IS_VALID;
                    if(params.nodeid){
                        object['nodeid']=PARAM_IS_VALID.nodeid;
                        object['updateat']=new Date();
                        object['updateby']=legit.username;
                    }else{
                        object['nodeid']=Uuid.random();
                        object['createat']=new Date();
                        object['createby']=legit.username;
                    }
                    
                    
                    let instance    =new models.instance.category(object);
                    let save        =instance.save({return_query: true});
                    return save;
                } 
                queries.push(category());
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
function update(req,res){
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
            //console.log(params);
            try{
                PARAM_IS_VALID=params;
                if(params.nodeid){
                    PARAM_IS_VALID['nodeid']=models.uuidFromString(params.nodeid);
                }
                let dateClock=(params.death_clock) ? params.death_clock : [];
                
                if(dateClock.length > 0){
                    PARAM_IS_VALID['death_clock']={ start:new Date(dateClock[0]) ,end: new Date(dateClock[1])}
                }else{
                    PARAM_IS_VALID['death_clock']={ }
                }
                PARAM_IS_VALID.title=(params.title) ? params.title : ' ';
            }catch (e){
                return res.send({status: 'invalid'})
            }
            callback(null,null);
        },
        function(callback){
            try{
               
                    let object=PARAM_IS_VALID;
                    var query_object = {nodeid:object.nodeid};
                    var update_values_object = {title: object.title,
                                                thumbnail: object.thumbnail,
                                                seo_link   :object.seo_link,
                                                category    : object.category,
                                                death_clock   :object.death_clock,
                                                updateat   : new Date(),
                                                updateby   : legit.username,
                                                meta_title :object.meta,
                                                meta_tag   :object.meta,
                                                meta_description   :object.meta_description
                                               };
                    var options = {ttl: 86400, if_exists: true};
                    models.instance.category.update(query_object, update_values_object, options,function(err){
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
function treeMap(req,res){
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
    let results={};
    let treeMap=[];
    async.series([
        function(callback){
            try{
                
            }catch (e){
                
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            models.instance.category.find({},{select : ['category','nodeid','title']},function(err,items){
              
                if(items && items.length > 0 )
                    {
                        /*
                       test(items,function(err,map){
                           treeMap=map;
                       }); */
                       treeMap= createTreeMap(items);
                       //treeMap=createTreeMap(treeMap);
                       //console.log(treeMap);    
                    }
                callback(err,null);    
            })
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: treeMap})
    })
}
function test(items,callback){
    let rootItem=[];
    let subMenu=[];
    let rootMap={};
    async.series([
        function(callback){
            items.map((e,i)=>{
                if(e.category){
                    let node={
                        title:e.title,
                        value:e.nodeid,
                        key:e.nodeid,
                        category:e.category,
                        nodeid:e.nodeid,
                    }
                    subMenu.push(node);
                }else{
                    let node={
                        title:e.title,
                        value:e.nodeid,
                        key:e.nodeid,
                        category:e.category,
                        nodeid:e.nodeid,
                    }
                    rootItem.push(node);
                }  
            });
            callback(null,null);
        },
        
        function(callback){
            let root={};
            let search={};
            let tt={};
            rootItem.map(e=>{
                root[e.nodeid]={}
                root[e.nodeid]['key']=e.nodeid;
                root[e.nodeid]['value']=e.nodeid;
                root[e.nodeid]['title']=e.title;
                root[e.nodeid]['nodeid']=e.nodeid;
                search=subMenu.filter(k => {
                    let mp=k.category[0].split('/');
                    if(mp.includes(e.key.toString())){
                        
                        let val=k.nodeid
                        k['key']=val
                        k['value']=val
                        k['children']=subMenu.filter(kk=>{
                                let mpp=kk.category[0].split('/');
                                if(mpp.includes(k.nodeid.toString())){
                                    let vall=kk.nodeid;
                                    kk['key']=vall;
                                    kk['value']=vall;
                                    kk['children']=k['children']
                                    return true;
                                }else{
                                    return false;
                                }
                            })
                        
                        
                        return true;
                    }else{
                        return false;
                    }
                    
                });
                
                root[e.nodeid]['children']=search;
                
            });
            
            rootMap=root;
            callback(null,null);
        },
        function(callback){
            let root={};
            
            callback(null,null)
        },
        
    ],function(err,result){
        callback(err,Object.values(rootMap));
    })
    
    
}
function createTreeMap(items){
    let children={};
    let parent={};
    let temp={};
    let rootItem=[];
    let subMenu=[];
    items.map(e=>{
        let node={
                title:e.title,
                value:e.nodeid,
                key:e.nodeid,
                category:e.category,
                nodeid:e.nodeid,
            }
        if(e.category && e.category.length > 0){
            subMenu.push(node);
        }else{
            rootItem.push(node);
        }
    });
    rootItem.map(e=>{
        e.children=filterNode(subMenu,e)
        e.children.map(b =>{
          b.children=filterNode(subMenu,b)
          b.children.map(c=>{
            c.children=filterNode(subMenu,c)
            c.children.map(d=>{
                d.children=filterNode(subMenu,d)
                d.children.map(k=>{
                    k.children=filterNode(subMenu,k)
                    k.children.map(l=>{
                        l.children=filterNode(subMenu,l)
                        l.children.map(p=>{
                            p.children=filterNode(subMenu,p)
                            p.children.map(n=>{
                                n.children=filterNode(subMenu,n)
                                n.children.map(m=>{
                                    m.children=filterNode(subMenu,m)
                                    m.children.map(s=>{
                                        s.children=filterNode(subMenu,s)
                                    })
                                })
                            })
                        })
                    })
                })
              })
            })
        })   
    })
    //console.log(rootItem[0].children[0].children[0])
    return rootItem;
}
function filterNode(items,node){
    return items.filter(f => {
        if(f.category && f.category.length > 0){
            return node.nodeid.toString()==f.category[0]
        }else{
            items.delete(f);
            return false;
        }
    })    
}
function createNode(items){
    let node={};
    node={
        title: '',
        value: '',
        key:'',
        children:[],
    }
    return node;
}
function list(req,res){
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
    let results=[];
    let current=1;
    let category=[];
    async.series([
        function(callback){
            try{
                current=req.query.current;
            }catch (e){
                
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            models.instance.category.find({$solr_query: '{"q":"title:*","sort": "createat desc"}'},{select : ['category','nodeid','title','thumbnail','createat','createby','death_clock']},function(err,items){
              
                if(items && items.length > 0 )
                    {
                       results=items; 
                    }
                callback(err,null);    
            })
        },
        function(callback){
            models.instance.category.find({},{select:['title','nodeid','category']},function(err,items){
                if(items && items.length > 0){
                    category=items
                }
                callback(err,null);
            });
        },
        function(callback){
            results.map(e=>{
                if(e.category && e.category.length > 0 ){
                    e.category.map(a=>{
                       e._breadcumb=generateMap(category,a)   
                    })
                }
            })
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: {list : results,pagination:{
            total: results.length || 1,current: current
        }}})
    })
}
function getBreadcumb(category,nodeid){
    return category.filter(node => {
        return node.nodeid.toString()==nodeid;
    });
}
function generateMap(category,nodeid){
    let parent=[];
    let temp={};
    let children={};
    var i=0;
    var node=nodeid;
    children=getBreadcumb(category,node);
    parent.push(children[0]);
    var i=1;
    if(children[0]){
        while(children[0].category!=null && i < 100){
            if(children[0].category && children[0].category.length > 0){
                node=children[0].category[0]
                children=getBreadcumb(category,node);
                parent.push(children[0]);
            }else{
               children=getBreadcumb(category,node);
               parent.push(children[0]);
            }
            i++;
        }
    }
    
    return parent.reverse();
    
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
function detail(req,res){
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
    let results=[];
    let PARAMS_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAMS_IS_VALID.nodeid=models.uuidFromString(req.query.nodeid)
            }catch (e){
                
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            models.instance.category.find({nodeid: PARAMS_IS_VALID.nodeid},{select : ['category','nodeid','title','thumbnail','seo_link','meta_title','meta_description','death_clock']},function(err,items){
              
                if(items && items.length > 0 )
                    {
                       results=items[0]; 
                    }
                callback(err,null);    
            })
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: results})
    })
}
function search(req,res){
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
    let results=[];
    let current=1;
    let PARAMS_IS_VALID={};
    let query='';
    let category=[];
    async.series([
        function(callback){
            try{
                current=req.body.current;
                search=req.body.q;
                let tempQuery='';
                if(req.body.nodeid){
                    tempQuery='"category : *'+req.body.nodeid+'*  "'
                }
                if(req.body.q){
                    if(tempQuery.length > 0){
                        tempQuery=tempQuery+ ' AND title: *'+req.body.q+'* '
                    }else{
                        tempQuery='"title: *'+req.body.q+'*"'
                    }
                }
                if(tempQuery && tempQuery.length > 0){
                    query='{"q":'+tempQuery+',"sort": "createat desc"}'
                }else{
                    query='{"q": "*:*","sort": "createat desc"}'
                }
            }catch (e){
                return res.send({status: 'error_01'})
            }
            callback(null,null);
        },
        function(callback){
            models.instance.category.find({$solr_query: query},{select : ['category','nodeid','title','thumbnail','createat','createby']},function(err,items){
              
                if(items && items.length > 0 )
                {
                    results=items; 
                }
                callback(err,null);    
            })
        },
        function(callback){
            models.instance.category.find({},{select:['title','nodeid','category']},function(err,items){
                if(items && items.length > 0){
                    category=items
                }
                callback(err,null);
            });
        },
        function(callback){
            results.map(e=>{
                if(e.category && e.category.length > 0 ){
                    e.category.map(a=>{
                       e._breadcumb=generateMap(category,a)   
                    })
                }
            })
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        res.send({status: 'ok',data: {list : results,pagination:{
            total: results.length || 1,current: current
        }}})
    })
}
function remove(req,res){
    var token=req.headers['x-access-token'];
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.status(403).send('expired'); 
    }
    var nodeid=req.query.id;
    var PARAM_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID.nodeid=models.uuidFromString(nodeid);
            }catch(e){
                return res.status(400).send('invalid')
            }
            callback(null,null);  
        },
        function(callback){
            var query_object = {nodeid: PARAM_IS_VALID.nodeid };
            models.instance.category.delete(query_object, function(err){
                callback(err,null);  
            });
        },
    ],function(err,result){
        if(err) return res.status(500).send('error');
        res.status(200).send('ok')
    })
    
}
export default {
  'POST /api/category/save'     : save,
  'PUT /api/category/UP'     : update,
  'GET /api/category/treemap'   : treeMap,   
  'GET /api/category/LS'        : list,   
  'GET /api/category/image/:imageid': image,
  'GET /api/category/DT'        : detail,   
  'POST /api/category/search'   : search,   
  'DELETE /api/category/DEL'   : remove,   
};
