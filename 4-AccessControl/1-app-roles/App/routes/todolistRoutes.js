const express = require('express');
const todolistController = require('../controllers/todolistController');

// initialize router
const router = express.Router();

// user routes
router.get('/', todolistController.getTodos);
router.post('/', todolistController.postTodo);

module.exports = router;