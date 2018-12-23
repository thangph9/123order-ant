module.exports={
    fields:{
        variantionsid : 'text',
        productid : 'uuid',
        lname : 'text', 
        name : 'text',
        price    : 'float',
        stock    : 'int',
        material :  'text',
        description     : 'text',
        thumbnail       : 'text',
        createat        :'timestamp',
        sale: {
            type: 'map',
            typeDef: '<text>'
        },
        attrs: {
            type: 'map',
            typeDef: '<text>'
        },
        images: {
            type: 'set',
            typeDef: '<text>'
        }, 
    },
    key:[["productid"],'variantionsid'] ,
} 