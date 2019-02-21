module.exports= {
    privateKey: "ThisIsMyPrivateKey",
    adminPassword:[
        'MyAdminOne@12345',
        'MyAdminTwo@12345'
    ],
    port: 8080,
    mysqlCred:{
        host:'localhost',
        user:'root',
        password:'ayush',
        database:'project'
    },
    mongoCred:
    {
        db:'project',
        collection: 'cab'
    }
}