const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

// GET /cards - Get all cards
router.get('/', cardController.getAllCards);

// POST /cards - Create card  
router.post('/', cardController.createCard);

// GET /cards/:id - Get card by ID
router.get('/:id', cardController.getCardById);

// PUT /cards/:id - Update card
router.put('/:id', cardController.updateCard);

// DELETE /cards/:id - Delete card
router.delete('/:id', cardController.deleteCard);

// GET /cards/board/:boardId - Get cards by board
router.get('/board/:boardId', cardController.getCardsByBoard);

module.exports = router;