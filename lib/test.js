const connectDB = require('./index.js')

var pg = async function () {

    const connectionString = process.env.MONGODB_CONNECTION || "postgres://bcuivepr:B3myWARZEhPCgwT4sQambp6-9JvO9noC@tuffi.db.elephantsql.com:5432/bcuivepr";
    const options = { client: 'sql', connectionString: connectionString, debug: true, collection: "/ADD/TP102T" }

    var dao = connectDB.factory(options);

    let ret = await dao.insert({ MANDT: "300", SPRAS: "E", PROCX: "00011", DESCR: "RD-e - Receipt of Electronic Documents", entry: new Date() })

    console.log(ret);

    options.projection = "*";

    dao = connectDB.factory(options);
    let crit = {
        'id': 1,
    };
    ret = await dao.list(crit);

    console.log(ret);

}();


