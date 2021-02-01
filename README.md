# add-core-dao-lib
add-core-dao-lib é uma library para Data Access Object do pacote ADD. Tem como objetivo abstratir a conexão com o banco de dados.

## Use
Install

`npm install https://github.com/gabriel-add/add-core-dao-lib.git --save`

Instace DAO Code:

```javascript
const connectDB = require("add-core-dao-lib");

const options ={
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING
}

const dao = connectDB.factory(options);
//...
```

Get one document code:

```javascript
const connectDB = require("add-core-dao-lib");

const options ={
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING
}

const dao = connectDB.factory(options);

const id = "5ff320da452fb547dc9a2e6e";

const entity = await dao.collection('colection.name').get(id);

```

List any documents by filter query code:

```javascript
const connectDB = require("add-core-dao-lib");

const options ={
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING
    collection: 'colection.name'
}

const dao = connectDB.factory(options);

const projection = ["to","from", "subject", "date"];
const filter = {"from":"gabriel.santos@addvisor.com.br"};

const entities = await dao.projection(projection).list(filter);

```

Create document code:

```javascript
const connectDB = require("add-core-dao-lib");

const dao = connectDB.factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING
    collection: 'colection.name'
});

let entity = {filed1: "data 1", field2: "data 2"..};
const entity = await dao.insert(entity);

console.log(entity.id);

```

Delete document code:

```javascript
const dao = require("add-core-dao-lib").factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING
    collection: 'colection.name'
});

const deleted = await dao.delete("5ff320da452fb547dc9a2e6e");
console.log(deleted);

```

Em alguns cenários podesse trabalhar com parte do documento, visto que outras aplicações podem agregar outros nós ao documento que não dizer a sua aplicação, com isso pode-se manipular a DAO informando o nó a qual esta restrito a trabalhar, conforme exemplos abaixo

Get one document node code:

```javascript
const dao = require("add-core-dao-lib").factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING,
    collection: 'colection.name'
});

const entity = await dao.node('data.email').get("5ff320da452fb547dc9a2e6e");

```

List document node code:

```javascript
const dao = require("add-core-dao-lib").factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING,
    collection: 'colection.name',
    node: 'data.email'
});

const projection = ["to","from", "subject", "date"];
const filter = {"from":"gabriel.santos@addvisor.com.br"};
const entity = await dao.projection(projection).list(filter);

```

Insert document node code:

```javascript
const dao = require("add-core-dao-lib").factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING,
    collection: 'colection.name',
    node: 'data.log'
});

let entity = {filed1: "data 1", field2: "data 2"..};
const entity = await dao.insert(entity);

```

Update document node code:

```javascript
const dao = require("add-core-dao-lib").factory({
    client: 'mongodb',
    connectionString: process.env.CONNECTION_STRING,
    collection: 'colection.name',
    node: 'data.log'
});

let entity = {filed1: "data 1", field2: "data 2"..};
const entity = await dao.update(entity, '60182965d6ff71150043ddc5');

```
## License

ADD Cloud - Addvisor