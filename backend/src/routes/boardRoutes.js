const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

// GET /boards - Get all boards
router.get('/', boardController.getAllBoards);

// POST /boards - Create board
router.post('/', boardController.createBoard);

// GET /boards/:id - Get board by ID
router.get('/:id', boardController.getBoardById);

// PUT /boards/:id - Update board
router.put('/:id', boardController.updateBoard);

// DELETE /boards/:id - Delete board
router.delete('/:id', boardController.deleteBoard);

module.exports = router;