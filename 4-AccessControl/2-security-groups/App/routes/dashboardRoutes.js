const express = require('express');

const dashboardController = require('../controllers/dashboardController');

// initialize router
const router = express.Router();

// admin route
router.get('/', dashboardController.getAllTodos);

module.exports = router;