const prisma = require("../prisma/prismaClient");


const getAllCards = async () => {
  try {
    return await prisma.card.findMany({
      where: {
        isArchived: false,
        isDeleted: false
      },
      include: { board: true },
      orderBy: { createdAt: 'desc' }
    });
  } catch (error) {
    console.error('Service error in getAllCards:', error);
    throw error;
  }
};

const createCard = async (data) => {
  try {
    return await prisma.card.create({
      data,
      include: { board: true }
    });
  } catch (error) {
    console.error('Service error in createCard:', error);
    throw error;
  }
};

const getCardById = async (id) => {
  try {
    return await prisma.card.findUnique({
      where: {
        id,
        isDeleted: false
      },
      include: { board: true }
    });
  } catch (error) {
    console.error('Service error in getCardById:', error);
    throw error;
  }
};

const updateCard = async (id, data) => {
  try {
    return await prisma.card.update({
      where: {
        id,
        isDeleted: false
      },
      data,
      include: { board: true }
    });
  } catch (error) {
    console.error('Service error in updateCard:', error);
    throw error;
  }
};

const deleteCard = async (id) => {
  try {
    return await prisma.card.update({
      where: { id },
      data: { isDeleted: true }
    });
  } catch (error) {
    console.error('Service error in deleteCard:', error);
    throw error;
  }
};

const getCardsByBoard = async (boardId) => {
  try {
    return await prisma.card.findMany({
      where: {
        boardId,
        isArchived: false,
        isDeleted: false
      },
      include: { board: true },
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Service error in getCardsByBoard:', error);
    throw error;
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