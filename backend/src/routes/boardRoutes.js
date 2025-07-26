const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Quản lý boards
 */

/**
 * @swagger
 * /boards:
 *   get:
 *     summary: Lấy danh sách tất cả boards
 *     tags: [Boards]
 *     responses:
 *       200:
 *         description: Danh sách boards trả về thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
router.get('/', boardController.getAllBoards);

/**
 * @swagger
 * /boards:
 *   post:
 *     summary: Tạo mới một board
 *     tags: [Boards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tạo board thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 */
router.post('/', boardController.createBoard);

/**
 * @swagger
 * /boards/{id}:
 *   get:
 *     summary: Lấy thông tin một board theo id
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Trả về thông tin board
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Không tìm thấy board
 */
router.get('/:id', boardController.getBoardById);

/**
 * @swagger
 * /boards/{id}:
 *   put:
 *     summary: Cập nhật thông tin board
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Cập nhật board thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       404:
 *         description: Không tìm thấy board
 */
router.put('/:id', boardController.updateBoard);

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Xóa một board
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Xóa board thành công
 *       404:
 *         description: Không tìm thấy board
 */
router.delete('/:id', boardController.deleteBoard);

module.exports = router;