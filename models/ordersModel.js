module.exports={
    fields:{
        sbill_code  : 'text',
        ddate       : 'timestamp',
        sname       : 'text',
        sphone      : 'varchar',
        saddress    : 'text',
        semail      : 'text',
        scode       : 'text',
        slinkproduct: 'text',
        snameproduct: 'text',
        ssize       : 'text',
        scolor      : 'text',
        iquality    : 'int',
        fwebprice   : 'float',
        fsale       : 'float',
        fshipweb    : 'float',
        fexchangerate :'float',
        fprice      :'float',
        fdeposit    :'float',
        frealpayprice :'float',
        fdelivery   :'float',
        fdeliveryprice :'float',
        fservicerate :'float',
        semployee   :'text',
        sstatus     :'text',
        scomment    :'text',  
        fsurcharge  :'float',
        ssurcharge  :'text',
        scurrency   :'text',
        status      :'text',
    },
    key:[["sbill_code"],"ddate"] ,
    indexes: ["sname","sphone"],
    clustering_order: {"ddate": "desc"},
    custom_indexes: [
        {
            on: 'sphone',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {mode : "CONTAINS"}
        },
        {
            on: 'sname',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {mode : "CONTAINS"}
        },
        {
            on: 'ddate',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        },
        {
            on: 'semployee',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        },
        {
            on: 'sstatus',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        },
        {
            on: 'status',
            using: 'org.apache.cassandra.index.sasi.SASIIndex',
            options: {}
        }
    ],
    
    //CREATE CUSTOM INDEX  orders_index ON orders (sname) USING 'org.apache.cassandra.index.sasi.SASIIndex';
    
} 
    