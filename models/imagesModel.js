module.exports={
    fields:{
        imageid  : 'uuid',
        image    : 'blob',
        options    : {
            type:'map',
            typeDef: '<text,text>'
        },
        createat    : 'timestamp',
    },
    key:["imageid"] ,
} 
    
