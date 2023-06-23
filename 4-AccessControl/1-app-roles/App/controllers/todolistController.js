const Todo = require('../model/todo');
const { nanoid } = require('nanoid');

exports.getTodos = (req, res) => {
    const owner = req.authContext.getAccount().idTokenClaims['oid'];

    const todos = Todo.getTodosByOwner(owner)

    res.render('todolist', { isAuthenticated: req.authContext.isAuthenticated(), todos: todos });
}

exports.postTodo = (req, res) => {
    const id = nanoid();
    const name = req.body.name;
    const owner = req.authContext.getAccount().idTokenClaims['oid'];

    const newTodo = new Todo(id, name, owner)

    Todo.postTodo(newTodo);
    
    res.redirect('/todolist');
}

exports.deleteTodo = (req, res) => {
    const id = req.body.id;
    const owner = req.authContext.getAccount().idTokenClaims['oid'];

    Todo.deleteTodo(id, owner);

    res.redirect('/todolist');
}