module.exports={
    fields:{
        nodeid      : 'uuid',
        category    :{
            type: 'set',
            typeDef: 'text',
        },
        groupid     :'text',
        title       :'text',
        thumbnail  :'text',
        seo_link   :'text',
        death_clock   :{
            type: 'map',
            typeDef: '<text,timestamp>'
        },
        createat   :'timestamp',
        createby   :'text',
        categoryIndex   : 'int',
        updateat   : 'timestamp',
        updateby   : 'text',
        meta_title      :'text',
        meta_tag        :'text',
        meta_description   :'text',
    },
    key:["nodeid"] ,
} 