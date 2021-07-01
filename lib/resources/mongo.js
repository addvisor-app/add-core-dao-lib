
const DAO = require('add-core-dao-lib/lib/resources/abstract.js')
var ObjectId = require('mongodb').ObjectID;

module.exports = class MongoDAO extends DAO {

    constructor(options) {
        super(options);
        super.projection({ '_id': 1 });
        this._log(this._connectionString);
        this._log(this._collection);
    }

    async get(id) {
        return new Promise((resolve, reject) => {

            let filter = { _id: new ObjectId(id) };
            let project = (this._node) ? { '_id': 1, [this._node]: 1 } : null;

            this._getDB().then(db => {
                let dbo = db.db();
                dbo.collection(this._collection).find(filter).project(project).toArray(function (err, result) {
                    if (err) throw err;
                    db.close();
                    const data = result[0];
                    data.id = data._id;
                    delete data._id;
                    resolve((result.length == 1) ? data : null);
                });
            })
                .catch(erro => reject(erro));
        })
            .catch(erro => { throw erro; });
    }

    list(filter) {
        return new Promise((resolve, reject) => {
            this._getDB().then(db => {
                let dbo = db.db();

                dbo.collection(this._collection)
                    .find(filter)
                    .project(this._projection)
                    .toArray(function (err, result) {

                        if (err) throw err;
                        db.close();
                        const list = result.map(el => {
                            let data = el;
                            data.id = data._id;
                            delete data._id;
                            return data;
                        });
                        resolve(list);
                    });

            })
                .catch(erro => reject(erro));
        });
    }

    listWithAllFields(filter) {
        return new Promise((resolve, reject) => {
            this._getDB().then(db => {
                let dbo = db.db();

                dbo.collection(this._collection)
                    .find(filter)
                    // .project(this._projection)
                    .toArray(function (err, result) {

                        if (err) throw err;
                        db.close();
                        const list = result.map(el => {
                            let data = el;
                            data.id = data._id;
                            delete data._id;
                            return data;
                        });
                        resolve(list);
                    });

            })
                .catch(erro => reject(erro));
        });
    }

    getAttributes() {

        return new Promise((resolve, reject) => {

            this._getDB().then(db => {

                let keys = db.runCommand({
                    "mapreduce": this._collection,
                    "map": function () {
                        for (var key in this) { emit(key, null); }
                    },
                    "reduce": function (key, stuff) { return null; },
                    "out": this._collection + "_keys"
                });

                resolve(db[keys.result].distinct("_id"));

            })
                .catch(erro => reject(erro));
        });
    }

    insert(entity) {

        entity.entry = new Date();
        if (this._node) {
            entity = this._setEntityNode(entity);
        }

        return new Promise((resolve, reject) => {
            if (!entity._id) {
                entity._id = new ObjectId();
                delete entity.id;
            }
            this._getDB().then(db => {
                let dbo = db.db();
                dbo.collection(this._collection).insertOne(entity, function (err, doc) {
                    if (err) throw err;
                    delete entity._id;
                    entity.id = doc.insertedId;
                    db.close();
                    resolve(entity);
                });
            }).catch(erro => {
                console.log(erro)
                reject(erro)
            });
        });
    }

    update(entity, id) {
        // if (this._node) {
        return new Promise((resolve, reject) => {

            let up = {};
            delete entity.id;

            if (this._node) {
                up = {
                    "$set": { [this._node]: entity }
                }
            } else {
                up = {
                    "$set": entity
                }
            };

            this._getDB().then(db => {
                let dbo = db.db();
                dbo.collection(this._collection).replaceOne(id, up, { upsert: true }).then((res) => {
                    db.close();
                    resolve(res);
                }).catch(erro => {
                    console.log(erro);
                    reject(erro)
                });
            }).catch(erro => {
                console.log(erro);
                reject(erro)
            });
        });
        /*        } else {
                   if (id)
                       entity.id = id;
                   return this.replace(entity);
               } */
    }


    replaceOne(entity) {
        return new Promise((resolve, c) => {
            this._getDB().then(db => {
                let dbo = db.db();
                let _id = entity.id;
                delete entity.id;
                dbo.collection(this._collection).update({ "_id": ObjectId(_id) }, entity).then(data => {
                    resolve(data);
                }).catch(error => {
                    reject(error);
                })
            });
        })
    }

    replace(entity) {
        return new Promise((resolve, reject) => {
            let filter = { _id: new ObjectId(entity.id) };
            delete entity.id;

            this._getDB().then(db => {
                let dbo = db.db();
                dbo.collection(this._collection).replaceOne(filter, entity, function (err, doc) {
                    if (err) throw err;
                    entity.id = entity._id;
                    delete entity._id;
                    db.close();
                    resolve(entity);
                });
            })
                .catch(erro => {
                    console.log(erro);
                    reject(erro)
                });
        });
    }

    delete(id) {
        return new Promise((resolve, reject) => {
            let filter = { _id: new ObjectId(id) };

            this._getDB().then(db => {
                let dbo = db.db();
                dbo.collection(this._collection).deleteOne(filter, function (err, result) {
                    db.close();
                    if (err) throw err;
                    resolve(true);
                });
            })
                .catch(erro => {
                    console.log(erro);
                    reject(erro)
                });
        });
    }

    projection(projection) {
        var mongoProj = projection.reduce((p, item) => {
            if (item !== 'id' && item !== '_id') {
                if (this._node) {
                    p[this._node + "." + item] = 1;
                } else {
                    p[item] = 1;
                }
            }
            return p;
        }, { '_id': 1 });
        super.projection(mongoProj);
        return this;
    }

    _setEntityNode(entity) {
        let last = '';
        const n = this._node.split('.').reverse().reduce((p, item, index) => {
            last = item;
            p[item] = (index == 0) ? entity : Object.assign({}, p);
            return p;
        }, {});
        return new Object({ [last]: n[last] });
    }

    _getDB() {
        return new Promise((resolve, reject) => {
            let client = require('mongodb').MongoClient;
            client.connect(this._connectionString,
                { useUnifiedTopology: true },
                function (err, db) {
                    if (err) {
                        let [date] = new Date().toLocaleString('pt-BR').split(', ');
                        // console.log("[", date, "DAO LIB ]", 'MONGO CONNECTION ERROR:', err);
                        reject(err);
                    }

                    db.on('close', function () {
                        let [date] = new Date().toLocaleString('pt-BR').split(', ');
                        //  console.log("[", date, "DAO LIB ]", 'MONGO CONNECTION event close:');
                    });
                    db.on('error', function (err) {
                        let [date] = new Date().toLocaleString('pt-BR').split(', ');
                        // console.log("[", date, "DAO LIB ]", 'MONGO CONNECTION event error:', err);
                    });
                    db.on('disconnect', function (err) {
                        let [date] = new Date().toLocaleString('pt-BR').split(', ');
                        // console.log("[", date, "DAO LIB ]", 'MONGO CONNECTION event disconnect:', err);
                    });
                    db.on('disconnected', function (err) {
                        let [date] = new Date().toLocaleString('pt-BR').split(', ');
                        // console.log("[", date, "DAO LIB ]", 'MONGO CONNECTION event disconnected:', err);
                    });

                    resolve(db);
                })
        });
    }
}