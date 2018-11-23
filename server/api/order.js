
const  moment   =require('moment');
const models    = require('../settings');
const utils    = require('./utils');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var multer  = require('multer');
var sizeOf = require('image-size');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
const upload          = multer();
var express=require("express");
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
    let listRole=[];
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
    let _from="";
    let _to="";
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
            
            callback(null,null);
       },
       function(callback){
            
            if(req.body.status){
                switch(req.body.status){
                    case 'paid':
                        try{
                            if(listRole.indexOf('view_paid')){
                                status="status:confirm";
                                ddate= "ddate_confirm:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
                                sort="ddate_confirm desc";
                            }else{
                                return res.send({status: 'invalid_view_paid'})
                            }
                        }catch(e){
                            return res.send({status: 'error_view_paid'})
                        }
                        callback(null,null);
                        break;
                    case 'delivery':
                        try{
                            if(listRole.indexOf('view_delivery')){
                               status="sstatus:paid";
                               ddate= "ddate_paid:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
                               sort="ddate_paid desc";
                            }else{
                                return res.send({status: 'invalid_view_delivery'})
                            }
                        }catch(e){
                            return res.send({status: 'error_view_delivery'})
                        }
                        
                        callback(null,null);
                        break;
                    case 'confirm':
                        try{
                            if(listRole.indexOf('view_confirm')){
                               status='status:(confirm OR processing)';
                               ddate= "ddate:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
                               sort="ddate desc";
                            }else{
                                return res.send({status: 'invalid_view_confirm'})
                            }
                        }catch(e){
                            return res.send({status: 'error_view_confirm'})
                        }
                        callback(null,null);
                        break;
                    case 'arrived':
                        try{
                            if(listRole.indexOf('view_arrived')){
                               status="status:arrived";
                               ddate= "ddate_arrived:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
                               sort="ddate_arrived desc";
                            }else{
                                return res.send({status: 'invalid_view_arrived'})
                            }
                        }catch(e){
                            return res.send({status: 'error_view_arrived'})
                        }
                        callback(null,null);
                        break;
                    default:
                        ddate= "ddate:["+_from+"T00:00:00Z TO "+_to+"T00:00:00Z]";
                        status='status:(confirm OR processing)'
                        sort="ddate desc";
                        callback(null,null);
                        break
                }
            }else{
                 callback(null,null); 
            }
            
       },
       function(callback){
            try{
                if(listRole.indexOf(legit.rule) > -1){
                    
                    emp="semployee:*";
                
                }
            }catch(e){
                
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
            models.instance.comment_by_user.find({},function(err,comment){
                
            });
           callback(null,null);
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
                PARAM_IS_VALID['fsale_extra']         =(body.sale_extra) ? parseFloat(body.sale_extra) : 0, 
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
                   let object ={
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
           if(body.comment){
               const comments_by_user=()=>{
                let object={
                    commentid    : Uuid.random(),
                    createat     : new Date(),
                    comment      : req.body.comment,
                    sbill_code   : PARAM_IS_VALID['sbill_code'],
                    username     : PARAM_IS_VALID['semployee'],
                }
                let instance    =new models.instance.comment_by_user(object);
                let save        =instance.save({return_query: true});
                return save;
                } 
               queries.push(comments_by_user());
                const comment_by_user=()=>{
                    let object={};
                     object['username']=legit.username;
                     object['sbill_code']=PARAM_IS_VALID.sbill_code;
                     object['comment']=PARAM_IS_VALID.scomment;
                     object['createat']=new Date();
                    let comment=new models.instance.comment_by_user(object);
                    let save   =comment.save({return_query: true});
                    return save;
                }
                queries.push(comment_by_user())
           } 
           
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
    let listRole=[]
    let locale={
                  'USD':'en-US',
                  'GBP':'en-GB',
                  'VND':'vi-VN',
                  'JPY':'ja-JP',
                  'EUR':'de-DE',
            }
    let PARAM_IS_VALID={},queries=[];
    let submit='add';
    var update_values_object = {};
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
                PARAM_IS_VALID=req.body;
                PARAM_IS_VALID['fwebprice']     =(body.fwebprice) ? currencyFormatter.unformat(body.fwebprice, { locale: locale[PARAM_IS_VALID.scurrency]})  : 0;
                PARAM_IS_VALID['fshipweb']      =(body.fshipweb) ? currencyFormatter.unformat(body.fshipweb, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;
                PARAM_IS_VALID['fexchangerate'] =(body.fexchangerate) ? currencyFormatter.unformat(body.fexchangerate, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;
                PARAM_IS_VALID['fprice']        =(body.fprice) ? currencyFormatter.unformat(body.fprice, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;

                PARAM_IS_VALID['fdeposit']      =(body.fdeposit) ? currencyFormatter.unformat(body.fdeposit, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;
                PARAM_IS_VALID['frealpayprice'] =(body.frealpayprice) ? currencyFormatter.unformat(body.frealpayprice, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;
                PARAM_IS_VALID['fdelivery']     =(body.fdelivery) ? currencyFormatter.unformat(body.fdelivery, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ;
                PARAM_IS_VALID['fdeliveryprice']=(body.fdeliveryprice) ? currencyFormatter.unformat(body.fdeliveryprice, { locale: locale[PARAM_IS_VALID.scurrency]}) : 0 ; 
                PARAM_IS_VALID['scurrency']=body.currency;
            if(req.body.submit){
                submit='update';
                switch(req.body.submit){
                    case 'update_status_confirm':
                        try{
                            if(listRole.indexOf('update_status_confirm') > -1 ){
                                PARAM_IS_VALID['ddate_confirm']=new Date().getTime();
                                update_values_object={
                                    ddate_confirm:PARAM_IS_VALID['ddate_confirm'],
                                    status: PARAM_IS_VALID.status
                                }
                            }else{
                                return res.send({status: 'invalid_rule_update_status_confirm'});
                            }

                        }catch(e){
                            return res.send({status: 'error_rule_update_status'});
                        } 
                        break;
                     case 'update_status_delivery':
                        try{
                            if(listRole.indexOf('update_status_delivery') > -1 ){
                                PARAM_IS_VALID['ddate_arrived']=new Date();  
                                update_values_object={
                                    ddate_arrived:   PARAM_IS_VALID['ddate_arrived'],
                                    status: PARAM_IS_VALID.status
                                }
                            }else{
                                return res.send({status: 'invalid_rule_update_status_delivery'});
                            }

                        }catch(e){
                            return res.send({status: 'error_rule_update_status'});
                        }
                        break;  
                    case 'update_sstatus':    
                        try{
                            if(listRole.indexOf('update_sstatus')  > -1){
                                PARAM_IS_VALID['ddate_paid']=new Date();
                                update_values_object={
                                    ddate_paid:   PARAM_IS_VALID['ddate_paid'],
                                    sstatus: PARAM_IS_VALID.sstatus
                                }
                            }else{
                                return res.send({status:'invalid_rule_update_sstatus'})
                            }
                        }catch(e){
                            return res.send({status:'error_rule_update_sstatus'})
                        }
                        break;
                    default:
                        return res.send({status:'invalid_submit'})
                        break;
                        
                }
             }
            
            callback(null,null);
        },
        function(callback){ 
            try{
                if(submit=='add'){
                    const orders=()=>{
                        let object      =PARAM_IS_VALID;
                        let instance    =new models.instance.orders(object);
                        let save        =instance.save({return_query: true,if_exists: true});
                        return save;
                    }
                    queries.push(orders());
                }
                if(submit=='update'){
                    const orders=()=>{
                        var query_object_update = {sbill_code:PARAM_IS_VALID.sbill_code};
                        var options = {return_query: true};
                        let save        =models.instance.orders.update(query_object_update, update_values_object, options )
                        return save;
                    }
                    queries.push(orders());
                }
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
               if(req.body.scomment){
                   const comment_by_user=()=>{
                        let object={
                            commentid    : Uuid.random(),
                            createat     : new Date(),
                            comment      : req.body.scomment,
                            sbill_code   : PARAM_IS_VALID['sbill_code'],
                            username     : PARAM_IS_VALID['semployee'],
                        }
                        let instance    =new models.instance.comment_by_user(object);
                        let save        =instance.save({return_query: true});
                        return save;
                    } 
                   queries.push(comment_by_user());
                }
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
function delOrder(req,res){
    var token=req.headers['x-access-token'];
    const sbill_code=req.query.id;
    var verifyOptions = {
     expiresIn:  '30d',
     algorithm:  ["RS256"]
    };
    var legit={};
    try{
        legit   = jwt.verify(token, publicKEY, verifyOptions);
    }catch(e){
        return res.send('expired'); 
    }
    let listRole=[
                'delete_order'
            ]
    var list=[],_list=[];
    async.series([
        function(callback){
            try{
                if(listRole.indexOf('delete_order') > -1){
                    }else{
                    return res.send({status:'error_rule'})
                }
            }catch(e){
                return res.send({status:'error_rule'})
            }
            
            callback(null,null);
        },
       function(callback){
           
            var query_object = {sbill_code: sbill_code};
            models.instance.orders.delete(query_object, function(err){
                callback(err,null);
            });
       }
    ],function(err,result){
        
        if(err) return res.send('error');
        res.send('ok')
    });
    
}
var router=express.Router();

router.put('/update_order',updateOrder);
router.post('/add',addOrder);
router.post('/list',getOrder);
router.delete('/del_row',delOrder);

/*
'PUT /api/order/update_order':updateOrder,    
  'POST /api/order/add':addOrder,
  'POST /api/order/list':getOrder,
  'DELETE /api/order/del_row':delOrder,
  */
module.exports = router;