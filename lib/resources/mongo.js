
const DAO = require('./abstract.js')
var ObjectId = require('mongodb').ObjectID;

module.exports = class MongoDAO extends DAO{

    constructor(options){
        super(options);
        super.projection({'_id':1});
    }
    
    getId(filter){
        this._log('connectionString', this._connectionString);
        this._log('collection', this._collection);
        this._log('projection', this._projection);
        this._log('filter', filter);
    }

    async get(id){
        return new Promise((resolve, reject) => {

            let filter = {_id: new ObjectId(id)};
           
            this._getDB().then(db => {
                    let dbo = db.db();
                    dbo.collection(this._collection).find(filter).project(this._projection).toArray(function(err, result) {
                        if (err) throw err;
                        db.close();
                        console.log('MAIL', result[0]);
                        resolve((result.length == 1) ? result[0] : null);
                    });
                })
                .catch(erro => reject(erro));
            })
            .catch(erro => {throw erro;});
    }

    list(filter){
        return new Promise((resolve, reject) => {
            this._getDB().then(db => {
                    let dbo = db.db();
                    dbo.collection(this._collection).find(filter).project(this._projection).toArray(function(err, result) {
                        if (err) throw err;
                        db.close();
                        resolve(result);
                    });
                })
                .catch(erro => reject(erro));
            });
    }

    insert(entity){
        return new Promise((resolve, reject) => {
            if(!entity._id){
                entity._id = new ObjectId();
                delete entity.id;
            }
            this._getDB().then(db => {
                    let dbo = db.db();
                    dbo.collection(this._collection).insertOne(entity, function(err, doc){
                        if (err) throw err;
                        delete entity._id;
                        entity.id = doc.insertedId;
                        db.close();
                        resolve(entity);
                    });
                })
                .catch(erro => reject(erro));
        });
    }

    replace(entity){
        return new Promise((resolve, reject) => {
            let filter = {_id: new ObjectId(entity.id)};
            delete entity.id;

            this._getDB().then(db => {
                    let dbo = db.db();
                    dbo.collection(this._collection).replaceOne(filter, entity, function(err, doc){
                        if (err) throw err;
                        entity.id = entity._id;
                        delete entity._id;
                        db.close();
                        resolve(entity);
                    });
                })
                .catch(erro => reject(erro));
        });
    }

    delete(id){
        return new Promise((resolve, reject) => {
            let filter = {_id: new ObjectId(id)};
           
            this._getDB().then(db => {
                    let dbo = db.db();
                    dbo.collection(this._collection).deleteOne(filter, function(err, result) {
                        db.close();
                        if (err) throw err;
                        resolve(true);
                    });
                })
                .catch(erro => reject(erro));
            });
    }

    projection(projection){
        var mongoProj = projection.reduce((p , item) => {
            if(item !== 'id' && item !== '_id'){
                p[item] = 1;
            }
            return p;
        }, {'_id':1});
        super.projection(mongoProj);
        return this;
    }

    _getDB(){
        return new Promise((resolve, reject) =>{
            let client = require('mongodb').MongoClient;
            client.connect(this._connectionString, 
                            { useUnifiedTopology: true }, 
                            function(err, db) {
                                if (err) reject(err);
                                resolve(db);
                            })
        });
    }
}