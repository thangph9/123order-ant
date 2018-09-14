module.exports={
    fields:{
        username: 'text', 
        enabled : 'boolean', 
        user_id : 'uuid',
        rule    : 'text',
        password                : 'text', 
        password_hash_algorithm : 'text',
        password_salt           : 'text'
    },
    key:[["username"]] ,
} 
    