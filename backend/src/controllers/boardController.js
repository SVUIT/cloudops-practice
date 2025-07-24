const boardService = require('../services/boardService');

const getAllBoards = async (req, res) => {
  try {
    const boards = await boardService.getAllBoards();
    res.json({
      success: true,
      data: boards,
      count: boards.length
    });
  } catch (error) {
    console.error('Error in getAllBoards:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const createBoard = async (req, res) => {
  try {
    const board = await boardService.createBoard(req.body);
    res.status(201).json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error in createBoard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const getBoardById = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await boardService.getBoardById(id);
    
    if (!board) {
      return res.status(404).json({
        success: false,
        error: 'Board not found'
      });
    }
    
    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error in getBoardById:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const updateBoard = async (req, res) => {
  try {
    const { id } = req.params;
    const board = await boardService.updateBoard(id, req.body);
    res.json({
      success: true,
      data: board
    });
  } catch (error) {
    console.error('Error in updateBoard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const { id } = req.params;
    await boardService.deleteBoard(id);
    res.json({
      success: true,
      message: 'Board deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteBoard:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};