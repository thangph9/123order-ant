module.exports={
    fields:{
        productid : 'uuid',
        brand: 'text', 
        name: 'text', 
        currency: 'text',
        lname: 'text', 
        style: 'text',
        type: 'text',
        category : 'text', 
        department : 'text',
        images: {
            type: 'set',
            typeDef:'<text>'
        },
        attrs:{
            type: 'map',
            typeDef: '<tex,frozen<set<text>>>'
        },
        description : 'text',
        infomation: 'text',
        material : 'text',
        createat    : 'timestamp',
        createby : 'text',
    },
    key:[["productid"]] ,
} 
