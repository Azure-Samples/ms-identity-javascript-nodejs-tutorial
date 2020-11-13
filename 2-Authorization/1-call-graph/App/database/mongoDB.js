const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const CONNECTION_STRING = 'mongodb+srv://derisen:t0alSrDxUDt5KlaI@cluster0.khxln.mongodb.net/test?retryWrites=true&w=majority';
let db;

exports.mongoConnect = (callback) => {
    MongoClient.connect(CONNECTION_STRING)
        .then(client => {
            db = client.db('test');
            callback();
        }).catch(err => {
            console.log(err);
        })
};

exports.getDB = () => {
    if (db) {
        return db;
    } else {
        throw err;
    }
}

exports.CONNECTION_STRING = CONNECTION_STRING;
