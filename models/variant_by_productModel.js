module.exports={
    fields:{
        productid: 'uuid',
        variantid: 'text',
        name: 'text',
        value: {
            type: 'set',
            typeDef: '<text>'
        },
        orderby: 'int',
        creatat: 'timestamp',
    },
    key:["productid","variantid"] ,
} 
    