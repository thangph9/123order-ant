import mockjs from 'mockjs';
const models    = require('../settings');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var multer  = require('multer')
import moment from 'moment';
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
const upload          = multer();

function getOrder(req,res){
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
    const listStatus={
        paid: "Đã đặt hàng",
        processing: "Đang xử lý",
        confirm : "Đã xác nhận",
        tranfer : "Đang chuyển hàng",
        arrived : "Đã về",
        completed: "Đã hoàn thành",
    }
    const listSstatus={
      pending   :'Chờ',
      paid      :'Đã mua',
      cancel    :'Cancel',
      back      :'Back cọc',
      tranfer   :'Chuyển cọc'   
    }
    let listRole=[
        'admin','superadmin','view_order_confirm','view_order_status'
    ];
    let filter_params={};
    let currentPage=1;
    let pageSize=10;
    let total=1;
    let limit=10000;
    var query={};
    var list=[],_list=[];
    var list_billCode=[];
    const locale={
      'USD':'en-US',
      'GBP':'en-GB',
      'VND':'vi-VN',
      'JPY':'ja-JP',
      'EUR':'de-DE',
    }
    var result=[];
    let q="";
    let fq="";
    let sort="ddate desc";
    let status="";
    let sstatus="";
    let ddate="";
    let sphone="";
    let sname="";
    let emp="";
    let snameproduct="";
    let ssize="";
    let scolor="";
    let scode="";
    async.series([
        function(callback){
           let uuid='';
           try{
               uuid=models.uuidFromString(legit.user_id);
           }catch(e){
               return res.send({status:"error_auth"})
           }
           models.instance.users.find({user_id:uuid},{select:['role']},function(err,user){
               listRole=(user) ? user : [];
               callback(null,null);
           })
       }, 
       function(callback){
            currentPage=(req.body.currentPage) ? req.body.currentPage : 2;
            pageSize=(req.body.pageSize) ? req.body.pageSize : 10;
            
            let _total=(currentPage*pageSize+pageSize) ;
            limit = (_total > 10000) ? (limit+_total) : 10000;
           
            if(req.body.name){
                sname="sname:*"+req.body.name+"*";
                //query['sname']={ '$like': '%'+req.body.name+'%' };
            } 
            if(req.body.phone){
                sphone="sphone:*"+req.body.phone+"*";
                //query['sphone']={'$like': '%'+req.body.phone+'%'};
            }
            if(req.body.sstatus){
                sstatus="sstatus:"+req.body.sstatus
                //query['sstatus']=req.body.sstatus;
            }
            if(req.body.snameproduct){
                snameproduct="snameproduct: *"+req.body.snameproduct+"*"
                //query['sstatus']=req.body.sstatus;
            }
            if(req.body.ssize){
                ssize="ssize:*"+req.body.ssize+"*"
                //query['sstatus']=req.body.sstatus;
            }if(req.body.scolor){
                scolor="scolor:*"+req.body.scolor+"*"
                //query['sstatus']=req.body.sstatus;
            }if(req.body.scode){
                scolor="scode:*"+req.body.scode+"*"
                //query['sstatus']=req.body.sstatus;
            }
            query['$limit']=limit 
            callback(null,null);    
       },
          
       function(callback){
           let from=moment().format("YYYY-MM-DD");
           let to=moment().format("YYYY-MM-DD");
           let _from="";
           let _to="";
           if(req.body.from){
               from=req.body.from;
               
           }
           if(req.body.to){
               to=req.body.to;
               
           }
            var start = new Date(from); // Your timezone!
            var estart = start.getTime();
            var end = new Date(to); // Your timezone!
            var eend = (end.getTime()/1000.0 + 86400)*1000;
            _from=moment(estart).format("YYYY-MM-DD");
            _to=moment(eend).format("YYYY-MM-DD");
           
            emp="semployee:"+legit.username;
            ddate= "ddate:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
            callback(null,null);
       },
       function(callback){
            
            if(req.body.status){
                switch(req.body.status){
                    case 'paid':
                        status="status:confirm";
                        callback(null,null);
                        break;
                    case 'delivery':
                        status="sstatus:paid";
                        callback(null,null);
                        break;
                    case 'confirm':
                        status='{!q.op=OR df=status}confirm processing'
                        callback(null,null);
                        break
                    case 'arrived':
                        status="status:arrived";
                        callback(null,null);
                        break
                        
                    default:
                        status='{!q.op=OR df=status}confirm processing'
                        callback(null,null);
                        break
                }
            }else{
                 callback(null,null); 
            }
            
       },
       function(callback){
           
            if(listRole.indexOf(legit.rule) > -1){
                emp="";
            }
            callback(null,null)  
        },
        
       function(callback){
            if(status.length > 0  ){
                status=status;
                q=status;
            }
            if(emp.length > 0){
                
                emp=(q.length >0) ? " AND "+emp : emp;
                q=q+emp;
            }
            if(sname.length > 0){ 
                sname=(q.length >0) ? " AND "+sname : sname;
                q=q+sname;
            }
           if(sphone.length > 0){
               sphone=(q.length >0) ? " AND "+sphone : sphone;
               q=q+sphone;
           }
           if(sstatus.length > 0){
               sstatus=(q.length >0) ? " AND "+sstatus : sstatus;
               q=q+sstatus;
           }
           if(snameproduct.length > 0){
               snameproduct=(q.length >0) ? " AND "+snameproduct : snameproduct;
               q=q+snameproduct;
           }
           if(scolor.length > 0){
               scolor=(q.length >0) ? " AND "+scolor : scolor;
               q=q+scolor;
           }
           if(ssize.length > 0){
               ssize=(q.length >0) ? " AND "+ssize : ssize;
               q=q+ssize;
           }if(scode.length > 0){
               ssize=(q.length >0) ? " AND "+scode : scode;
               q=q+scode;
           }
           if(ddate.length > 0){
               ddate=(q.length >0) ? " AND "+ddate : ddate;
               q=q+ddate;
           }
           let istart=(currentPage-1)*pageSize;
           let irows=pageSize;
           if(currentPage==1){
               istart=0
           }
           let paging=',"start":'+istart+',"rows":'+irows;
           
            query={
                $solr_query:'{"q":"'+q+'","sort":"'+sort+'","paging":"driver"}',
            }
            console.log(query);
            models.instance.orders.find(query,function(err,items){
                try{
                    items.map((e)=>{
                        let n=JSON.stringify(e);
                        let l=JSON.parse(n);
                        l['_deposit']=currencyFormatter.format(e.fdeposit, { locale: 'en-US',code: "VND"});
                        l['_price']=currencyFormatter.format(e.fprice, { locale: 'en-US',code: "VND"  });
                        l['_realpayprice']=currencyFormatter.format(e.frealpayprice, { locale: 'en-US',code: "VND" });
                        l['_deliveryprice']=currencyFormatter.format(e.fdeliveryprice, { locale: 'en-US',code: "VND" });
                        l['_exchangerate']=currencyFormatter.format(e.fexchangerate, { locale: 'en-US',code: "VND" });
                        l['_sale']=(e.fsale) ? e.fsale+"%" : "0%"
                        l['_servicerate']=(e.fservicerate) ? e.fservicerate+"%" : "0%"
                        l['_webprice']=currencyFormatter.format(e.fwebprice, { locale:'en-US',code: e.scurrency });
                        l['_shipweb']=currencyFormatter.format(e.fshipweb, { locale:'en-US',code:e.scurrency });
                        l['_surcharge']=currencyFormatter.format(e.fsurcharge, { locale:'en-US',code:e.scurrency  });
                        l['ssize']=(e.ssize) ? e.ssize : ' ';
                        l['_sstatus']=listSstatus[e.sstatus];
                        l['_status']=listStatus[e.status] || 'Đang xử lý';
                        list.push(l)
                    })
                }catch(e){
                    
                }
             callback(err,null);
            });
            
       },
      
       function(callback){
            total=list.length;
            let start=currentPage*pageSize-pageSize;
            let end=currentPage*pageSize-1;
            /*
            result = list.slice(start, end)
            list.sort(function(a,b){
                return a.ddate > b.ddate;
            })*/
            callback(null,null)
        }
    ],function(err,result){
        if(err) return res.send({status:'error'});
        res.send({
            list:list,
            pagination:{total: total, pageSize: pageSize, current: currentPage}
        })
    });
    
}
function addOrder(req,res){
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
    
    let queries=[];
    let PARAM_IS_VALID={};
    async.series([
        function(callback){
            try{
                PARAM_IS_VALID['sbill_code']    =body.bill, 
                PARAM_IS_VALID['ddate']         =new Date(),
                PARAM_IS_VALID['sname']         =body.name,
                PARAM_IS_VALID['sphone']        =body.phone,
                PARAM_IS_VALID['saddress']      =body.address,
                PARAM_IS_VALID['semail']        =body.email,
                PARAM_IS_VALID['scode']         =body.code,
                PARAM_IS_VALID['slinkproduct']  =body.link,
                PARAM_IS_VALID['snameproduct']  =body.product_name, 
                PARAM_IS_VALID['ssize']         =body.size, 
                PARAM_IS_VALID['scolor']        =body.color, 
                PARAM_IS_VALID['iquality']      =(body.amount) ? parseInt(body.amount,10) : 0 ,
                PARAM_IS_VALID['fwebprice']     =(body.web_price) ? parseFloat(body.web_price) : 0,
                PARAM_IS_VALID['fsale']         =(body.sale) ? parseFloat(body.sale) : 0, 
                PARAM_IS_VALID['fshipweb']      =(body.shipWeb) ? parseFloat(body.shipWeb) : 0 ,
                PARAM_IS_VALID['fexchangerate'] =(body.rate) ? parseFloat(body.rate) : 0 ,
                PARAM_IS_VALID['fprice']        =(body.price) ? parseFloat(body.price) : 0 ,

                PARAM_IS_VALID['fdeposit']      =(body.deposit) ? parseFloat(body.deposit) : 0 ,
                PARAM_IS_VALID['frealpayprice'] =(body.realpayprice) ? parseFloat(body.realpayprice) : 0 ,
                PARAM_IS_VALID['fdelivery']     =(body.delivery) ? parseFloat(body.delivery) : 0 ,
                PARAM_IS_VALID['fdeliveryprice']=(body.deliveryprice) ? parseFloat(body.deliveryprice) : 0 ,
                PARAM_IS_VALID['fservicerate']  =(body.servicerate && !Number.isNaN(body.servicerate) ) ? parseFloat(body.servicerate) : 0 ,
                PARAM_IS_VALID['semployee']     =legit.username,
                PARAM_IS_VALID['sstatus']       =body.status,
                PARAM_IS_VALID['scomment']      =body.comment,
                PARAM_IS_VALID['scurrency']      =body.currency,
                PARAM_IS_VALID['surcharge']     =(body.surcharge) ? parseFloat(body.surcharge) : 0 ,
                PARAM_IS_VALID['ssurcharge']    =body.ssurcharge,
                PARAM_IS_VALID['scomment']      =body.comment,
                PARAM_IS_VALID['status']        ="processing";
            }catch(e){
                return res.send({status: 'error'})
            }
            
            callback(null,null);
            
        },
        function(callback){
            
            const orders=()=>{
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.orders(object);
                let save        =instance.save({return_query: true});
                return save;
            }
           queries.push(orders());
            const orders_update=()=>{
                const uid=Uuid.random();
                let object      =PARAM_IS_VALID;
                object['uid']   =uid;
                let instance    =new models.instance.orders_update(object);
                let save        =instance.save({return_query: true});
                return save;
            }  
           queries.push(orders_update());
            
           const order_by_member=()=>{
                let object      ={
                    sbill_code: PARAM_IS_VALID['sbill_code'] ,
                    semployee: PARAM_IS_VALID['semployee'] ,
                    ddate: PARAM_IS_VALID['ddate'] ,
                };
                let instance    =new models.instance.order_by_member(object);
                let save        =instance.save({return_query: true});
                return save;
           }    
           queries.push(order_by_member());
            const orders_by_status=()=>{
                   let object      ={
                       sbill_code: PARAM_IS_VALID['sbill_code'],
                       semployee: PARAM_IS_VALID['semployee'] ,
                       ddate: PARAM_IS_VALID['ddate'] ,
                       sstatus:PARAM_IS_VALID['sstatus'],
                       status: PARAM_IS_VALID['status']
                   };
                    let instance    =new models.instance.orders_by_status(object);
                    let save        =instance.save({return_query: true});
                    return save;
               }
            queries.push(orders_by_status())
           callback(null,null);
        },
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        models.doBatch(queries,function(err){
            if(err) return res.send({status: 'error'});
            res.send({ status: 'ok'});
        });
    })
}

function updateOrder(req,res){
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
    let listRole=[
                'update_sstatus','update_status','update_delevery'
    ]
    
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
              
               listRole=(user) ? user : [];
               callback(null,null);
           })
        }, 
        function(callback){
            PARAM_IS_VALID=req.body;
            
            if(req.body.sstatus){
                    if(listRole.indexOf('update_sstatus')  > -1){

                    }else{
                        return res.send({status:'error_rule_update_sstatus'})
                    }
             }
            if(req.body.status){
                 if(listRole.indexOf('update_status') > -1 ){

                }else{
                    return res.send({status: 'error_rule_update_status'});
                }
            }
            
            callback(null,null);
        },
        function(callback){ 
            try{
                delete PARAM_IS_VALID['name'];
                delete PARAM_IS_VALID['phone'];
                const orders=()=>{
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.orders(object);
                let save        =instance.save({return_query: true,if_exists: true});
                return save;
                }
               queries.push(orders());
                const orders_update=()=>{
                    const uid=Uuid.random();
                    let object      =PARAM_IS_VALID;
                    object['uid']   =uid;
                    object['supdateat']  =legit.username;
                    object['dupdateat']  =new Date();
                    let instance    =new models.instance.orders_update(object);
                    let save        =instance.save({return_query: true});
                    return save;
                } 
               queries.push(orders_update());
               const orders_by_status=()=>{
                    let object      ={
                        sbill_code: PARAM_IS_VALID.sbill_code,
                        sstatus: PARAM_IS_VALID.sstatus,
                        status: PARAM_IS_VALID.status
                    };
                    object['semployee']  =legit.username;
                    object['ddate']  =new Date();
                    let instance    =new models.instance.orders_by_status(object);
                    let save        =instance.save({return_query: true});
                    return save;
               }
               queries.push(orders_by_status())
            }catch(e){
                return res.send({status: 'error_01'});
            }
            
           callback(null,null);
        },
    ],function(err,result){
           if(err) return res.send({status: 'error_02'});
         try{
             models.doBatch(queries,function(err){
                if(err) return res.send({status: 'error_03'});
                return res.send({ status: 'ok'});
            });
         }catch(e){
             return res.send({status: 'error_04'});
         }
            
    });
    
}
function getDetail(req,res){
    let product=[];
    let PARAMS_IS_VALID={};
    async.series([
        function(callback){
            PARAMS_IS_VALID=req.body;
            callback(null,null)  
        },
        function(callback){
            models.instance.product_detail_amazon.find({asin:PARAMS_IS_VALID.asin },function(err,items){
                
                product=(items) ? items : [];
                callback(err,null)
            })
            
        }
    ],function(err,result){
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            detail:product,
           
        })
    })
}
function getProducts(req,res){
    let products=[];
    let pageSize=(req.query.pageSize) ? req.query.pageSize : 10;
    let current=(req.query.current) ?  req.query.pageSize : 1; 
    let start=( current > 1 ) ? current*pageSize : 0;
    async.series([
        
        function(callback){
            models.instance.product_detail.find({$solr_query: '{"q":"*:*","sort":"createat asc "}'},function(err,items){
                
                products=(items) ? items : [];
                callback(err,null)
            })
            
        }
    ],function(err,result){
        console.log(err);
        if (err) return  res.send({status: "error",products:[ ]});
        res.send({
            list:products,
            pagination:{total: products.length, pageSize: pageSize, current: current}})
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
                PARAM_IS_VALID['nodeid']=params.nodeid;
                PARAM_IS_VALID['price']=(params.price) ? parseFloat(params.price) : 0;
                PARAM_IS_VALID['sale']=(params.sale) ? parseFloat(params.sale) : 0;
                PARAM_IS_VALID['sale_price']=(params.sale_price) ? parseFloat(params.sale_price) : 0;
                let dateClock=(params.death_clock) ? params.death_clock : [];
                PARAM_IS_VALID['death_clock']={ start:dateClock[0] ,end: dateClock[1]}
                PARAM_IS_VALID['image_huge']= params.image_huge;
                PARAM_IS_VALID['image_large']= params.image_large;
                PARAM_IS_VALID['image_small']= params.image_small;
                PARAM_IS_VALID['infomation']= {
                    dimensions:params.dimensions,
                    item_weight:params.item_weight,
                    asin:params.asin,
                    model_number:params.model_number,
                    shipping_weight:params.shipping_weight,
                }
                console.log(PARAM_IS_VALID);
            }catch (e){
                return res.send({status: 'error'})
            }
            callback(null,null);
        },
        function(callback){
            try{
                const product=()=>{
                    const productid=Uuid.random();
                    let object      =PARAM_IS_VALID;
                    object['productid']   =productid;
                    object['createby']  =legit.username;
                    object['createat']  =new Date();
                    
                    let instance    =new models.instance.product_detail(object);
                    let save        =instance.save({return_query: true});
                    return save;
                } 
                 queries.push(product());
            }catch(e){
                return res.send({status: 'error'})
            }
                
           
            callback(null,null);
        }
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        try{
             models.doBatch(queries,function(err){
                if(err) return res.send({status: 'error_03'});
                return res.send({ status: 'ok'});
            });
         }catch(e){
             return res.send({status: 'error_04'});
         }
    })
}
function uploadFile(req,res){
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
                console.log(err)
            });
       }catch(e){
           console.log(e);
           return res.send({status:'error'})
       }
       res.send({status:'ok',file:{imageid}})
   })
}

export default {
  'GET /api/product/list': getProducts,
  'POST /api/product/save': saveProduct,
  'POST /api/upload': uploadFile    
};
