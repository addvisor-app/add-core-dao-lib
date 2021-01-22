const connectDB = require('./index.js')


var test = async function (){
    const connectionString = process.env.MONGODB_CONNECTION || "mongodb+srv://add_admin:Addvisor2020@cluster0.jex0n.mongodb.net/add";
    const options = {client: 'mongodb', connectionString:connectionString, debug:true, collection:'mailbox.emails'}
    
    const dao = connectDB.factory(options);
    
    const mail = await dao.collection('mailbox.emails')
                    .projection(["id", "to","from"])
                    .list({})
    
    console.log('FIM', mail);    
}();
