const database = require('../database/mongoDB');
const mongodb = require('mongodb');

class Note {
    constructor(title, description, status) {
        this.title = title;
        this.description = description;
        this.status = status;
    }

    saveNote() {
        database.getDB().collection('notes').insertOne(this)
            .then(result => {
                console.log(result);
                console.log('success!');
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteNote(id) {
        return database.getDB().collection('notes').deleteOne({_id: new mongodb.ObjectId(id)});
    }

    static updateNote(id, description, status) {
        return database.getDB().collection('notes')
            .updateOne({_id: new mongodb.ObjectId(id)}, {$set: {description: description, status: status}});
    }

    static getAll() {
        return database.getDB().collection('notes').find().toArray()
            .then(result => {
                console.log(result);
                return result;
            })
            .catch(err => {
                console.log(err);
            });
    }
}

module.exports = Note;