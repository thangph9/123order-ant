module.exports={
    fields:{
        user_id: 'uuid',
        username: 'text', //unicode
        email: 'text',
        phone: 'text',
        name: 'text',
        address: 'text',
        createat: 'timestamp',
        updateat: 'timestamp',
        last_login: 'timestamp',
        rule: {
            type: "set",
            typeDef: "<text>"
        }
    },
    key:[["user_id"]] ,
} 
    