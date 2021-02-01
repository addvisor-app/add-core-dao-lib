const connectDB = require('./index.js')


var test = async function (){
    const connectionString = process.env.MONGODB_CONNECTION || "mongodb+srv://add_admin:Addvisor2020@cluster0.jex0n.mongodb.net/add";
    const options = {client: 'mongodb', connectionString:connectionString, debug:true, collection:'instance.rde'}
    
    const dao = connectDB.factory(options);
    
    /*
    const mail = await dao.collection('mailbox.emails')
                    .projection(["id", "to","from"])
                    .list({})
    */
   const m = { seqno: 1,
                html:'<html><head><meta http-equiv="content-type" content="text/html; charset=utf-8" /></head><body style=\'font-size: 10pt; font-family: Verdana,Geneva,sans-serif\'>\n<p>tretertret</p>\n\n</body></html>\n',
                text: 'TST 3',
                subject: 'Teste ADD Core Mailbox API',
                messageId: '5a4e29baee1f8889edd93c16862310f2@addvisor.com.br',
                from: [ { address: 'tecban@addvisor.com.br', name: '' } ],
                to:[ { address: 'tecban@addvisor.com.br',name: 'Tecban QA Addvisor' } ],
                attachments: null }
   
   //const mail = await dao.node('data.email').insert(m);
   //const mail = await dao.node('data.email').update(m, '60182965d6ff71150043ddc5');
   //const mail = await dao.node('data.email').projection(["to", "from", "subject"]).list({});
   //console.log('FIM', mail[0].data.email);

   const mail = await dao.node('data.email').get('60182965d6ff71150043ddc5');

   console.log('FIM', mail);

}();
