const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowdb(adapter);

class Todo {

    id;
    name;
    owner;

    constructor(id, name, owner) {
        this.id = id;
        this.name = name;
        this.owner = owner;
    }

    static getAllTodos() {
        return db.get('todos')
            .value();
    }

    static getTodosByOwner(owner) {
        return db.get('todos')
            .filter({ owner: owner })
            .value();
    }

    static postTodo(newTodo) {
        db.get('todos').push(newTodo).write();
    }

    static deleteTodo(id, owner) {
        db.get('todos')
            .remove({ owner: owner, id: id })
            .write();
    }
}

module.exports = Todo;