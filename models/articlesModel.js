module.exports={
    fields:{
        artid  : 'uuid',
        title   :'text',
        content   :'text',
        image   :'text',
        short_desc   :'text',
        expired   :{
            type: 'map',
            typeDef: '<text,timestamp>'
        },
        createat   :'timestamp',
        createat   :'timestamp',
    },
    key:["artid"] ,
} 