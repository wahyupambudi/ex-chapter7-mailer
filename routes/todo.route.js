const express = require('express')
const router = express.Router()
const { Get, Insert, Update, Delete } = require('../controller/todo.controller')
const { CheckPostTodos } = require('../middleware/middleware')
const { Authenticate, checkTokenBlacklist,  restrictPostTodos } = require("../middleware/restrict");


// Get Todolist
/**
 * @swagger
 * /api/v1/todo:
 *   get:
 *     tags:
 *      - "CRUD Todolist"
 *     summary: Get all Todolist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of Todolist
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   userId:
 *                     type: integer
 *                   task:
 *                      type: string
 *                   description:
 *                      type: string
 *                   start:
 *                      type: string
 *                   finish:
 *                      type: string
 *                   status:
 *                      type: string
 */
router.get('/', Authenticate, checkTokenBlacklist,  Get)


// Post Todolist
/**
 * @swagger
 * /api/v1/todo:
 *   post:
 *     tags:
 *      - "CRUD Todolist"
 *     summary: Create a new Todolist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               task:
 *                 type: string
 *               description:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date-time
 *               finish:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Todolist created successfully
 */
router.post('/', CheckPostTodos, Authenticate, checkTokenBlacklist,  Insert)


// Update Todolist
/**
 * @swagger
 * /api/v1/todo/{id}:
 *   put:
 *     tags:
 *      - "CRUD Todolist"
 *     summary: Update an Todolist by ID
 *     security:
 *       - bearerAuth: []
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
 *               task:
 *                 type: string
 *               description:
 *                 type: string
 *               start:
 *                 type: string
 *                 format: date-time
 *               finish:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Todolist updated successfully
 */
router.put('/:id', Authenticate, checkTokenBlacklist,  Update)

// Delete
/**
 * @swagger
 * /api/v1/todo/{id}:
 *   delete:
 *     tags:
 *      - "CRUD Todolist"
 *     summary: Delete an Todolist by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Todolist deleted successfully
 */
router.delete('/:id', Authenticate, checkTokenBlacklist,  Delete)

module.exports = router