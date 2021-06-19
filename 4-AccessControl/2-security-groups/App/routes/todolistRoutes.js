const express = require('express');
const todolistController = require('../controllers/todolistController');

// initialize router
const router = express.Router();

// todolist routes
router.get('/', todolistController.getTodos);

router.post('/', todolistController.postTodo);

router.delete('/', todolistController.deleteTodo);

module.exports = router;