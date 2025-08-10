const express = require('express');
const boardController = require('../controllers/boardController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Boards
 *   description: Quản lý Boards
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
 *                     type: string
 *                   title:
 *                     type: string
 *                   order:
 *                     type: integer
 *                   isDeleted:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                   cards:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         title:
 *                           type: string
 *                         order:
 *                           type: integer
 *                         boardId:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
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
 *             required:
 *               - title
 *               - order
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Kế hoạch học kỳ"
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tạo board thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 title:
 *                   type: string
 *                 order:
 *                   type: integer
 *                 isDeleted:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
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
 *           type: string
*     responses:
 *       200:
 *         description: Trả về thông tin board và danh sách các cards liên quan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 order:
 *                   type: integer
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *                 isDeleted:
 *                   type: boolean
 *                 cards:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       content:
 *                         type: string
 *                       description:
 *                         type: string
 *                       subjectName:
 *                         type: string
 *                       semester:
 *                         type: string
 *                       typeSubject:
 *                         type: string
 *                       dueDate:
 *                         type: string
 *                         format: date-time
 *                       labels:
 *                         type: array
 *                         items:
 *                           type: string
 *                       order:
 *                         type: integer
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
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Kế hoạch học kỳ"
 *               order:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật board thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 title:
 *                   type: string
 *                 order:
 *                   type: integer
 *                 isDeleted:
 *                   type: boolean
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Không tìm thấy board
 */
router.put('/:id', boardController.updateBoard);

/**
 * @swagger
 * /boards/{id}:
 *   delete:
 *     summary: Xóa một board theo ID
 *     tags: [Boards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa board thành công
 *       404:
 *         description: Không tìm thấy board
 */
router.delete('/:id', boardController.deleteBoard);

module.exports = router;