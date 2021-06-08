const lowdb = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('./data/db.json');
const db = lowdb(adapter);

exports.getAllTodos = (req, res) => {
    const todos = db.get('todos')
        .value();

    res.render('dashboard', { isAuthenticated: req.session.isAuthenticated, todos: todos });
}