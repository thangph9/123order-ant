import mockjs from 'mockjs';
const models    = require('../settings');
const async     = require("async");
const Uuid      = require("cassandra-driver").types.Uuid;
const jwt       = require('jsonwebtoken');
const fs        =require('fs');
var publicKEY  = fs.readFileSync('./ssl/jwtpublic.pem', 'utf8');  
const titles = [
  'Alipay',
  'Angular',
  'Ant Design',
  'Ant Design Pro',
  'Bootstrap',
  'React',
  'Vue',
  'Webpack',
];
const avatars = [
  'https://gw.alipayobjects.com/zos/rmsportal/WdGqmHpayyMjiEhcKoVE.png', // Alipay
  'https://gw.alipayobjects.com/zos/rmsportal/zOsKZmFRdUtvpqCImOVY.png', // Angular
  'https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png', // Ant Design
  'https://gw.alipayobjects.com/zos/rmsportal/sfjbOqnsXXJgNCjCzDBL.png', // Ant Design Pro
  'https://gw.alipayobjects.com/zos/rmsportal/siCrBXXhmvTQGWPNLBow.png', // Bootstrap
  'https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png', // React
  'https://gw.alipayobjects.com/zos/rmsportal/ComBAopevLwENQdKWiIn.png', // Vue
  'https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png', // Webpack
];

const avatars2 = [
  'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
  'https://gw.alipayobjects.com/zos/rmsportal/cnrhVkzwxjPwAaCfPbdc.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gaOngJwsRYRaVAuXXcmB.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ubnKSIfAJTxIgXOKlciN.png',
  'https://gw.alipayobjects.com/zos/rmsportal/WhxKECPNujWoWEFNdnJE.png',
  'https://gw.alipayobjects.com/zos/rmsportal/jZUIxmJycoymBprLOUbT.png',
  'https://gw.alipayobjects.com/zos/rmsportal/psOgztMplJMGpVEqfcgF.png',
  'https://gw.alipayobjects.com/zos/rmsportal/ZpBqSxLxVEXfcUNoPKrz.png',
  'https://gw.alipayobjects.com/zos/rmsportal/laiEnJdGHVOhJrUShBaJ.png',
  'https://gw.alipayobjects.com/zos/rmsportal/UrQsqscbKEpNuJcvBZBu.png',
];

const covers = [
  'https://gw.alipayobjects.com/zos/rmsportal/uMfMFlvUuceEyPpotzlq.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iZBVOIhGJiAnhplqjvZW.png',
  'https://gw.alipayobjects.com/zos/rmsportal/iXjVmWVHbCJAyqvDxdtx.png',
  'https://gw.alipayobjects.com/zos/rmsportal/gLaIAoVWTtLbBWZNYEMg.png',
];
const desc = [
  '那是一种内在的东西， 他们到达不了，也无法触及的',
  '希望是一个好东西，也许是最好的，好东西是不会消亡的',
  '生命就像一盒巧克力，结果往往出人意料',
  '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
  '那时候我只会想自己想要什么，从不想自己拥有什么',
];

const user = [
  '付小小',
  '曲丽丽',
  '林东东',
  '周星星',
  '吴加好',
  '朱偏右',
  '鱼酱',
  '乐哥',
  '谭小仪',
  '仲尼',
];

function fakeList(count) {
  const list = [];
  for (let i = 0; i < count; i += 1) {
    list.push({
      id: `fake-list-${i}`,
      owner: user[i % 10],
      title: titles[i % 8],
      avatar: avatars[i % 8],
      cover: parseInt(i / 4, 10) % 2 === 0 ? covers[i % 4] : covers[3 - (i % 4)],
      status: ['active', 'exception', 'normal'][i % 3],
      percent: Math.ceil(Math.random() * 50) + 50,
      logo: avatars[i % 8],
      href: 'https://ant.design',
      updatedAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      createdAt: new Date(new Date().getTime() - 1000 * 60 * 60 * 2 * i),
      subDescription: desc[i % 5],
      description:
        '在中台产品的研发过程中，会出现不同的设计规范和实现方式，但其中往往存在很多类似的页面和组件，这些类似的组件会被抽离成一套标准规范。',
      activeUser: Math.ceil(Math.random() * 100000) + 100000,
      newUser: Math.ceil(Math.random() * 1000) + 1000,
      star: Math.ceil(Math.random() * 100) + 100,
      like: Math.ceil(Math.random() * 100) + 100,
      message: Math.ceil(Math.random() * 10) + 10,
      content:
        '段落示意：蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。蚂蚁金服设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态，提供跨越设计与开发的体验解决方案。',
      members: [
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/ZiESqWwCXBRQoaPONSJe.png',
          name: '曲丽丽',
          id: 'member1',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/tBOxZPlITHqwlGjsJWaF.png',
          name: '王昭君',
          id: 'member2',
        },
        {
          avatar: 'https://gw.alipayobjects.com/zos/rmsportal/sBxjgqiuHMGRkIjqlQCd.png',
          name: '董娜娜',
          id: 'member3',
        },
      ],
    });
  }

  return list;
}

let sourceData;

function getFakeList(req, res) {
  const params = req.query;

  const count = params.count * 1 || 20;

  const result = fakeList(count);
  sourceData = result;
  return res.json(result);
}

function postFakeList(req, res) {
  const { /* url = '', */ body } = req;
  // const params = getUrlParams(url);
  const { method, id } = body;
  // const count = (params.count * 1) || 20;
  let result = sourceData;

  switch (method) {
    case 'delete':
      result = result.filter(item => item.id !== id);
      break;
    case 'update':
      result.forEach((item, i) => {
        if (item.id === id) {
          result[i] = Object.assign(item, body);
        }
      });
      break;
    case 'post':
      result.unshift({
        body,
        id: `fake-list-${result.length}`,
        createdAt: new Date().getTime(),
      });
      break;
    default:
      break;
  }

  return res.json(result);
}

const getNotice = [
  {
    id: 'xxx1',
    title: titles[0],
    logo: avatars[0],
    description: '那是一种内在的东西，他们到达不了，也无法触及的',
    updatedAt: new Date(),
    member: '科学搬砖组',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx2',
    title: titles[1],
    logo: avatars[1],
    description: '希望是一个好东西，也许是最好的，好东西是不会消亡的',
    updatedAt: new Date('2017-07-24'),
    member: '全组都是吴彦祖',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx3',
    title: titles[2],
    logo: avatars[2],
    description: '城镇中有那么多的酒馆，她却偏偏走进了我的酒馆',
    updatedAt: new Date(),
    member: '中二少女团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx4',
    title: titles[3],
    logo: avatars[3],
    description: '那时候我只会想自己想要什么，从不想自己拥有什么',
    updatedAt: new Date('2017-07-23'),
    member: '程序员日常',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx5',
    title: titles[4],
    logo: avatars[4],
    description: '凛冬将至',
    updatedAt: new Date('2017-07-23'),
    member: '高逼格设计天团',
    href: '',
    memberLink: '',
  },
  {
    id: 'xxx6',
    title: titles[5],
    logo: avatars[5],
    description: '生命就像一盒巧克力，结果往往出人意料',
    updatedAt: new Date('2017-07-23'),
    member: '骗你来学计算机',
    href: '',
    memberLink: '',
  },
];

const getActivities = [
  {
    id: 'trend-1',
    updatedAt: new Date(),
    user: {
      name: '曲丽丽',
      avatar: avatars2[0],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-2',
    updatedAt: new Date(),
    user: {
      name: '付小小',
      avatar: avatars2[1],
    },
    group: {
      name: '高逼格设计天团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-3',
    updatedAt: new Date(),
    user: {
      name: '林东东',
      avatar: avatars2[2],
    },
    group: {
      name: '中二少女团',
      link: 'http://github.com/',
    },
    project: {
      name: '六月迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
  {
    id: 'trend-4',
    updatedAt: new Date(),
    user: {
      name: '周星星',
      avatar: avatars2[4],
    },
    project: {
      name: '5 月日常迭代',
      link: 'http://github.com/',
    },
    template: '将 @{project} 更新至已发布状态',
  },
  {
    id: 'trend-5',
    updatedAt: new Date(),
    user: {
      name: '朱偏右',
      avatar: avatars2[3],
    },
    project: {
      name: '工程效能',
      link: 'http://github.com/',
    },
    comment: {
      name: '留言',
      link: 'http://github.com/',
    },
    template: '在 @{project} 发布了 @{comment}',
  },
  {
    id: 'trend-6',
    updatedAt: new Date(),
    user: {
      name: '乐哥',
      avatar: avatars2[5],
    },
    group: {
      name: '程序员日常',
      link: 'http://github.com/',
    },
    project: {
      name: '品牌迭代',
      link: 'http://github.com/',
    },
    template: '在 @{group} 新建项目 @{project}',
  },
];

function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
}
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
    var list=[],_list=[];
    async.series([
       function(callback){
            callback(null,null);    
       },
       function(callback){
            models.instance.order_by_member.find({},function(err,items){
                list=(items && items.length> 0 ) ? items : [];
                callback(err,null);
                
            })
            
       }
    ],function(err,result){
        if(err) return res.send({status:'error'});
        res.send({
            list:list,
            pagination:{total: 46, pageSize: 10, current: 1}
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
            PARAM_IS_VALID['iquality']      =(body.amount && body.amount!=undefined  ) ? parseInt(body.amount,10) : 0 ,
            PARAM_IS_VALID['fwebprice']     =(body.web_price && body.web_price!=undefined  ) ? parseFloat(body.web_price) : 0,
            PARAM_IS_VALID['fsale']         =(body.sale && body.sale!=undefined  ) ? parseFloat(body.sale) : 0, 
            PARAM_IS_VALID['fshipweb']      =(body.shipWeb && body.shipWeb!=undefined  ) ? parseFloat(body.shipWeb) : 0 ,
            PARAM_IS_VALID['fexchangerate'] =(body.rate && body.rate!=undefined  ) ? parseFloat(body.rate) : 0 ,
            PARAM_IS_VALID['fprice']        =(body.price && body.price!=undefined  ) ? parseFloat(body.price) : 0 ,
            PARAM_IS_VALID['fdeposit']      =(body.deposit && body.deposit!=undefined  ) ? parseFloat(body.deposit) : 0 ,
            PARAM_IS_VALID['frealpayprice'] =(body.realpayprice && body.realpayprice!=undefined  ) ? parseFloat(body.realpayprice) : 0 ,
            PARAM_IS_VALID['fdelivery']     =(body.delivery && body.delivery!=undefined  ) ? parseFloat(body.delivery) : 0 ,
            PARAM_IS_VALID['fdeliveryprice']=(body.deliveryprice && body.deliveryprice!=undefined  ) ? parseFloat(body.deliveryprice) : 0 ,
            PARAM_IS_VALID['fservicerate']  =(body.servicerate && body.servicerate!=undefined  ) ? parseFloat(body.deliveryprice) : 0 ,
            PARAM_IS_VALID['semployee']     =legit.username,
            PARAM_IS_VALID['sstatus']       =body.status,
            PARAM_IS_VALID['scomment']      =body.comment,
                
            callback(null,null);
            
        },
        function(callback){
            
            
            const order_by_member=()=>{
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.order_by_member(object);
                let save        =instance.save({return_query: true});
                return save;
            }
           queries.push(order_by_member());
            const order_by_member_update=()=>{
                const uid=Uuid.random();
                let object      =PARAM_IS_VALID;
                object['uid']   =uid;
                let instance    =new models.instance.order_by_member_update(object);
                let save        =instance.save({return_query: true});
                return save;
            } 
           queries.push(order_by_member_update());
           callback(null,null);
        },
        
        
    ],function(err,result){
        if(err) return res.send({status: 'error'});
        models.doBatch(queries,function(err){
            user['username']=PARAM_IS_VALID.username;
            //console.log(queries);
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
    
    let PARAM_IS_VALID={},queries=[];
    async.series([
        function(callback){
            PARAM_IS_VALID=req.body;
            callback(null,null);
        },
        function(callback){
            const order_by_member=()=>{
                
                let object      =PARAM_IS_VALID;
                let instance    =new models.instance.order_by_member(object);
                let save        =instance.save({return_query: true});
                return save;
            }
           queries.push(order_by_member());
            const order_by_member_update=()=>{
                const uid=Uuid.random();
                let object      =PARAM_IS_VALID;
                object['uid']   =uid;
                object['supdateat']  =legit.username;
                object['dupdateat']  =new Date();
                
                let instance    =new models.instance.order_by_member_update(object);
                let save        =instance.save({return_query: true});
                return save;
                
            } 
           queries.push(order_by_member_update());
           callback(null,null);
        },
    ],function(err,result){
           if(err) return res.send({status: 'error'});
            models.doBatch(queries,function(err){
                user['username']=PARAM_IS_VALID.username;
                //console.log(queries);
                if(err) return res.send({status: 'error'});
                res.send({ status: 'ok'});
            });
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
    var list=[],_list=[];
    async.series([
       function(callback){
            callback(null,null);    
       },
       function(callback){
            var query_object = {sbill_code: sbill_code};
            models.instance.order_by_member.delete(query_object, function(err){
                callback(err,null);
            });
       }
    ],function(err,result){
        if(err) return res.send('error');
        res.send('ok')
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
        console.log(e);
       return  res.send({status: 'expired'}); 
    }
    
    async.series([
        function(callback){
            models.instance.order_by_bill_code.find({types: 'KL'},{raw:true, allow_filtering: true},function(err,r){
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
            billCode='KL'+_code;
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

export default {
  'GET /api/project/notice': getNotice,
  'GET /api/activities': getActivities,
  'POST /api/forms': (req, res) => {
    res.send({ message: 'Ok' });
  },
  'PUT /api/order/edit_ceil':updateOrder,    
  'POST /api/order/add':addOrder,
  'GET /api/order/list':getOrder,
  'DELETE /api/order/del_row':delOrder,
  'POST /api/user/check_account':checkAccount , 
  'GET /api/generate/bill_code':generateOrderBillCode,       
      
      
  'GET /api/tags': mockjs.mock({
    'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
  }),
  'GET /api/fake_list': getFakeList,
  'POST /api/fake_list': postFakeList,
  'GET /api/captcha': getFakeCaptcha,
};