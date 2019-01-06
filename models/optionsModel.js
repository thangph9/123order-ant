module.exports={
    fields:{
        optid: 'uuid',
        productid: 'uuid',
        price: 'float',
        amount: 'float',
        attrs: {
            type: 'map',
            typeDef: '<text,text>'
        },
        images: {
            type: 'set',
            typeDef: '<text>'
        }
    },
    key:["productid","optid"],
} 
    