const prisma = require("../prisma/prismaClient");


const getAllBoards = async () => {
  console.log(process.env.DATABASE_URL);
  try {
    return await prisma.board.findMany({
      where: { isDeleted: false },
      include: {
        cards: {
          where: {
            isArchived: false,
            isDeleted: false
          },
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { order: 'asc' }
    });
  } catch (error) {
    console.error('Service error in getAllBoards:', error);
    throw error;
  }
};

const createBoard = async (data) => {
  try {
    console.log('Service: Creating board with data:', data);
    const board = await prisma.board.create({ data });
    console.log('Service: Board created successfully:', board.id);
    return board;
  } catch (error) {
    console.error('Service error in createBoard:', error);
    throw error;
  }
};

const getBoardById = async (id) => {
  try {
    return await prisma.board.findUnique({
      where: {
        id,
        isDeleted: false
      },
      include: {
        cards: {
          where: {
            isArchived: false,
            isDeleted: false
          },
          orderBy: { order: 'asc' }
        }
      }
    });
  } catch (error) {
    console.error('Service error in getBoardById:', error);
    throw error;
  }
};

const updateBoard = async (id, data) => {
  try {
    return await prisma.board.update({ where: { id }, data });
  } catch (error) {
    console.error('Service error in updateBoard:', error);
    throw error;
  }
};

const deleteBoard = async (id) => {
  try {
    return await prisma.board.update({
      where: { id },
      data: { isDeleted: true }
    });
  } catch (error) {
    console.error('Service error in deleteBoard:', error);
    throw error;
  }
};

module.exports = {
  getAllBoards,
  createBoard,
  getBoardById,
  updateBoard,
  deleteBoard,
};