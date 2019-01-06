module.exports={
    fields:{
        productid: 'uuid',
        price: 'float',
        sale: {
            type: 'map',
            typeDef:'<text,text>'
        },
        descriptions:{
            type: 'map',
            typeDef: '<text,text>'
        },
        images: {
            type: 'set',
            typeDef: '<text>'
        },
        nodeid: {
            type: 'set',
            typeDef: '<text>'
        },
        name: 'text',
        lname: 'text',
        thumbnail: 'text',
        brand: 'text',
        style: 'text',
        type : 'text',
        seller: 'text',
        brand: 'text',
        manufacturer: 'text',
        size_type: 'text',
        amount: 'int',
        currency: 'text',
    },
    key:["productid"],
} 
    