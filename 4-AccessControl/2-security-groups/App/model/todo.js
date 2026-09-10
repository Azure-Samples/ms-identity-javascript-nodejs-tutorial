const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', 'data', 'db.json');

const readTodos = () => JSON.parse(fs.readFileSync(databasePath, 'utf8')).todos;
const writeTodos = (todos) => fs.writeFileSync(databasePath, JSON.stringify({ todos }, null, 2));

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
        return readTodos();
    }

    static getTodosByOwner(owner) {
        return readTodos().filter((todo) => todo.owner === owner);
    }

    static postTodo(newTodo) {
        writeTodos([...readTodos(), newTodo]);
    }

    static deleteTodo(id, owner) {
        writeTodos(readTodos().filter((todo) => todo.owner !== owner || todo.id !== id));
    }
}

module.exports = Todo;