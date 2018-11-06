module.exports={
    fields:{
        productid : 'uuid',
        asin: 'text', 
        title : 'text', 
        price : 'float',
        sale    : 'float',
        sale_price: 'float',
        createat    : 'timestamp',
        sale            : 'int',
        thumbnail      : 'text',
        reviews      : 'text',
        seller     : 'text',
        brand      : 'text',
        style      : 'text',
        star                 : 'text',
        color                 : 'text',
        size                 : 'text',
        node_name          : 'text',
        nodeid                 :{
            type: "set",
            typeDef:"<text>"
        },
        description    : 'text',
        desc_detail    : 'text',
        death_clock    : {
            type: "map",
            typeDef: "<text,timestamp>"
        },
        infomation      : { 
            type: "map",
            typeDef: "<text, text>"},
        image_large     :{
            type: "set",
            typeDef:"<text>"
        },
        image_huge  :{
            type: "set",
            typeDef: "<text>"
        },
        image_small:{
            type: "set",
            typeDef: "<text>"
        },
        createby : 'text',
    },
    key:[["productid"]] ,
} 