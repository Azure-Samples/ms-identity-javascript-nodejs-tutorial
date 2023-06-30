const Todo = require('../model/todo');
const { nanoid } = require('nanoid');

exports.getTodos = (req, res) => {
    /**
     * The 'oid' (object id) is the only claim that should be used to uniquely identify
     * a user in an Azure AD tenant. The token might have one or more of the following claim,
     * that might seem like a unique identifier, but is not and should not be used as such,
     * especially for systems which act as system of record (SOR):
     *
     * - upn (user principal name): might be unique amongst the active set of users in a tenant but
     * tend to get reassigned to new employees as employees leave the organization and
     * others take their place or might change to reflect a personal change like marriage.
     *
     * - email: might be unique amongst the active set of users in a tenant but tend to get
     * reassigned to new employees as employees leave the organization and others take their place.
     */
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