'use strict';
const MongoDAO = require('./resources/mongo.js')
const KnexDAO = require('./resources/pg.js')

exports.factory = (options) => {


    const client = (options.client) ? options.client : 'MONGO';

    let dao = null;
    switch (client) {
        case 'mongodb':
            dao = new MongoDAO(options);
            break;
        case 'hanadb':
            dao = new MongoDAO(options);
            break;
        case 'pg':
            dao = new KnexDAO(options);
            break;
        default:
            dao = new MongoDAO(options);
    }
    return dao;
}
