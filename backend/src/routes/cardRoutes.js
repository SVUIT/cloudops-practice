const express = require('express');
const cardController = require('../controllers/cardController');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Quản lý thẻ học tập (cards)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Card:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         boardId:
 *           type: string
 *         content:
 *           type: string
 *         description:
 *           type: string
 *         order:
 *           type: integer
 *         subjectName:
 *           type: string
 *         semester:
 *           type: string
 *         typeSubject:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         isArchived:
 *           type: boolean
 *         labels:
 *           type: array
 *           items:
 *             type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         isDeleted:
 *           type: boolean
 *
 *     CardInput:
 *       type: object
 *       required:
 *         - boardId
 *         - content
 *         - order
 *         - subjectName
 *         - semester
 *         - typeSubject
 *       properties:
 *         boardId:
 *           type: string
 *         content:
 *           type: string
 *         description:
 *           type: string
 *         order:
 *           type: integer
 *         subjectName:
 *           type: string
 *         semester:
 *           type: string
 *         typeSubject:
 *           type: string
 *         dueDate:
 *           type: string
 *           format: date-time
 *         labels:
 *           type: array
 *           items:
 *             type: string
 */

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Lấy tất cả cards
 *     tags: [Cards]
 *     responses:
 *       200:
 *         description: Trả về danh sách cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/', cardController.getAllCards);

/**
 * @swagger
 * /cards:
 *   post:
 *     summary: Tạo một card mới
 *     tags: [Cards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CardInput'
 *     responses:
 *       201:
 *         description: Card đã được tạo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 */
router.post('/', cardController.createCard);

/**
 * @swagger
 * /cards/{id}:
 *   get:
 *     summary: Lấy thông tin card theo ID
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Trả về thông tin card
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Không tìm thấy card
 */
router.get('/:id', cardController.getCardById);

/**
 * @swagger
 * /cards/{id}:
 *   put:
 *     summary: Cập nhật thông tin card
 *     tags: [Cards]
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
 *             $ref: '#/components/schemas/CardInput'
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Card'
 *       404:
 *         description: Không tìm thấy card
 */
router.put('/:id', cardController.updateCard);

router.put('/:id', cardController.updateCard);

/**
 * @swagger
 * /cards/{id}:
 *   delete:
 *     summary: Xóa một card
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Xóa thành công
 *       404:
 *         description: Không tìm thấy card
 */
router.delete('/:id', cardController.deleteCard);

/**
 * @swagger
 * /cards/board/{boardId}:
 *   get:
 *     summary: Lấy tất cả card theo boardId
 *     tags: [Cards]
 *     parameters:
 *       - in: path
 *         name: boardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Danh sách card theo board
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Card'
 */
router.get('/board/:boardId', cardController.getCardsByBoard);

module.exports = router;