// src/services/userService.js
const prisma = require("../prisma/prismaClient");

// Get all users
const getAllUsers = async () => {
  return await prisma.user.findMany();
};

// Create a new user
const createUser = async (data) => {
  return await prisma.user.create({ data });
};

// Get a user by ID
const getUserById = async (id) => {
  return await prisma.user.findUnique({ where: { id: Number(id) } });
};

// Update a user
const updateUser = async (id, data) => {
  return await prisma.user.update({ where: { id: Number(id) }, data });
};

// Delete a user
const deleteUser = async (id) => {
  return await prisma.user.delete({ where: { id: Number(id) } });
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};