const Todo = require('../model/todo');

exports.getAllTodos = (req, res) => {
    const todos = Todo.getAllTodos();

    res.render('dashboard', { isAuthenticated: req.authContext.isAuthenticated(), todos: todos });
}