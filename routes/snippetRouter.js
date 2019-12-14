'use strict'

const express = require('express')
const router = express.Router()
const { check } = require('express-validator/check')

const controller = require('../controllers/snippetController')

// GET /
router.get('/', controller.index)
router.get('/create', controller.create)
router.post('/create', [check('title', 'Title is required').notEmpty(), check('description', 'snippet is required').notEmpty()], controller.createPost)
// GET, POST /edit
router.get('/edit/:id', controller.edit)
router.post('/edit', [check('title', 'Title is required').notEmpty(), check('description', 'snippet is required').notEmpty()], controller.editPost)

// GET, POST  /delete
router.get('/delete/:id', controller.delete)
router.post('/delete', controller.deletePost)

// Exports.
module.exports = router
