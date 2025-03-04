const express = require('express')
const { check, body } = require('express-validator/check')
const authController = require('../controllers/authController')

const router = express.Router()

router.get('/login', authController.getLogin)

router.get('/signup', authController.getSignup)

router.post('/login', authController.postLogin)

router.post('/signup', [check('name').isLength({ min: 3 }).withMessage('User name must be at least 3 Characters long and only alphabets or numbers').isAlphanumeric().trim(),
  body(
    'password',
    'Please enter a password with only numbers and text and at least 5 characters.'
  )
    .isLength({ min: 5 })
    .isAlphanumeric().trim(),
  body('confirmPassword').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords have to match!')
    }
    return true
  })
],
authController.postSignup)

router.get('/logout', authController.logout)

module.exports = router
