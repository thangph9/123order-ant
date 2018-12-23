module.exports={
    fields:{
        productid: 'uuid',
        currency: 'text',
        name: 'text',
        lname: 'text',
        sale: 'float',
        sale_price: 'float',
        view_seo_link: 'text',
        price: 'float',
        department: 'text',
        category: 'text',
        images: {
            type: "set",
            typeDef: "<text>"
        },
        private_option:  {
            type: "list",
            typeDef: "<frozen<map<text,text>>>"
        },
        attrs:  {
            type: "map",
            typeDef: "<text,frozen<set<frozen<map<text,text>>>>>"
        },
        attr: {
            type: "map",
            typeDef: "<text,text>"
        },
        variants: {
            type: "list",
            typeDef: "<frozen<map<text,text>>>"
        },
    },
    key:["productid"] ,
} 
