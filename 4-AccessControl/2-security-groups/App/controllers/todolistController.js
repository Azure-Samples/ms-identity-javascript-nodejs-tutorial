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
    const owner = req.authContext.getAccount().idTokenClaims['oid'];
    req.body._method === "DELETE" ? deleteTodo(req, owner) : addTodo(req, owner);
    
    res.redirect('/todolist');
}

const addTodo = (req, owner) => {
    const id = nanoid();
    const name = req.body.name;

    const newTodo = new Todo(id, name, owner)

    Todo.postTodo(newTodo);
};

const deleteTodo = (req, owner) => {
    const id = req.body.id;

    Todo.deleteTodo(id, owner);
};