const cardService = require('../services/cardService');

const getAllCards = async (req, res) => {
  try {
    const cards = await cardService.getAllCards();
    res.json({
      success: true,
      data: cards,
      count: cards.length
    });
  } catch (error) {
    console.error('Error in getAllCards:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const createCard = async (req, res) => {
  try {
    const card = await cardService.createCard(req.body);
    res.status(201).json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Error in createCard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getCardById = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await cardService.getCardById(id);
    
    if (!card) {
      return res.status(404).json({
        success: false,
        error: 'Card not found'
      });
    }
    
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Error in getCardById:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await cardService.updateCard(id, req.body);
    res.json({
      success: true,
      data: card
    });
  } catch (error) {
    console.error('Error in updateCard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    await cardService.deleteCard(id);
    res.json({
      success: true,
      message: 'Card deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteCard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getCardsByBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const cards = await cardService.getCardsByBoard(boardId);
    res.json({
      success: true,
      data: cards,
      count: cards.length
    });
  } catch (error) {
    console.error('Error in getCardsByBoard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllCards,
  createCard,
  getCardById,
  updateCard,
  deleteCard,
  getCardsByBoard,
};