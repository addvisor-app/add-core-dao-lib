
const DAO = require('./abstract.js')
const knex = require('knex');

module.exports = class KnexDAO extends DAO {

    constructor(options) {
        super(options);
        super.projection();
        console.log(this._connectionString);
        console.log(this._collection);
    }

    async list(filter, fn) {
        let This = this;
        try {
            return new Promise((resolve, reject) => {
                this._getDB().then(db => {
                    db.select('*').from(this._collection).where(filter)
                        .then(function (data) {
                            resolve(data);
                        });
                }).catch(erro => reject(erro));
            });
        } catch (erro) {
            return erro;
        }
    };

    insert(entity) {
        entity.entry = new Date();
        let This = this;
        try {
            return new Promise((resolve, reject) => {
                this._getDB().then(db => {
                    db.schema.createTableIfNotExists(This._collection,
                        function (table) {
                            table.increments();
                            for (const key in entity) {
                                table.string(key);
                            }
                        }).then(function () {
                            resolve(db.insert(entity).into(This._collection).returning('id'));
                        }).catch(erro => reject(erro));
                }).catch(erro => reject(erro));
            });
        } catch (erro) {
            return erro;
        }
    }

    delete(where) {
        let This = this;
        return new Promise((resolve, reject) => {
            this._getDB().then(db => {
                db(This._collection)
                    .where(where)
                    .del();
            }).catch(erro => reject(erro));
        });
    }

    _getDB() {
        return new Promise((resolve, reject) => {

            let client = knex({
                client: 'pg',
                connection: this._connectionString
            });

            resolve(client);
        })
    }

    drop() {

        this._getDB().then(db => {

            db.schema.dropTableIfExists(This._collection);

        }).catch(erro => erro);

    }
}

