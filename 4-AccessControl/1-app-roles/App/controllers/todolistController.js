const Todo = require('../model/todo');
const { nanoid } = require('nanoid');

exports.getTodos = (req, res) => {
    const owner = req.session.account.idTokenClaims['preferred_username'];

    const todos = Todo.getTodosByOwner(owner)

    res.render('todolist', { isAuthenticated: req.session.isAuthenticated, todos: todos });
}

exports.postTodo = (req, res) => {
    const id = nanoid();
    const name = req.body.name;
    const owner = req.session.account.idTokenClaims['preferred_username'];

    const newTodo = new Todo(id, name, owner)

    Todo.postTodo(newTodo);
    
    res.redirect('/todolist');
}

exports.deleteTodo = (req, res) => {
    const id = req.body.id;
    const owner = req.session.account.idTokenClaims['preferred_username'];

    Todo.deleteTodo(id, owner);

    res.redirect('/todolist');
}