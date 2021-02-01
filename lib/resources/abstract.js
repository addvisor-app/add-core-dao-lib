'use strict';

module.exports = class AbstractDAO{
    
    constructor(options){
        this._connectionString = options.connectionString;
        this._debug = options.debug;
        this._collection = options.collection;
        this._projection = options.projection;
        this._node = options.node;
    }

    collection(name){
        this._collection = name;
        return this;
    }

    node(name){
        this._node = name;
        return this;
    }

    projection(projection){
        this._projection = projection;
        return this;
    }

    async _log (...args) {
        if(this._debug){
            let [date] = new Date().toLocaleString('pt-BR').split(', ');
            console.log(date, "DAO LIB -", ...args);
        }
    }
}
