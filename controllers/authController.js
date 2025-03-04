const bcrypt = require('bcryptjs')
const { validationResult } = require('express-validator/check')
const User = require('../models/user')
const authController = {}

authController.getLogin = (req, res, next) => {
  res.render('auth/login')
}

authController.getSignup = (req, res, next) => {
  res.render('auth/signup')
}

authController.postLogin = (req, res, next) => {
  const name = req.body.name
  const password = req.body.password
  User.findOne({ name: name })
    .then(user => {
      if (!user) {
        req.session.flash = { type: 'danger', text: 'Invalid Username.' }
        return res.redirect('/login')
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          if (doMatch) {
            req.session.isLoggedIn = true
            req.session.user = user
            return req.session.save(err => {
              if (err) {
                console.log(err)
              }
              res.redirect('/')
            })
          }
          req.session.flash = { type: 'danger', text: 'Invalid password.' }
          res.redirect('/login')
        })
        .catch(err => {
          console.log(err)
          res.redirect('/login')
        })
    })
    .catch(err => console.log(err))
}

authController.postSignup = (req, res, next) => {
  const name = req.body.name
  const password = req.body.password
  const validationError = validationResult(req)
  if (!validationError.isEmpty()) {
    req.session.flash = { type: 'danger', text: validationError.array()[0].msg }
    return res.redirect('/signup')
  }
  User.findOne({ name: name })
    .then(userDoc => {
      if (userDoc) {
        req.session.flash = { type: 'danger', text: 'name exists already, please pick a different one.' }
        return res.redirect('/signup')
      }
      return bcrypt
        .hash(password, 12)
        .then(hashedPassword => {
          const user = new User({
            name: name,
            password: hashedPassword

          })
          return user.save()
        })
        .then(result => {
          res.redirect('/login')
        })
    })
    .catch(err => {
      console.log(err)
    })
}

authController.logout = (req, res, next) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err)
    }
    res.redirect('/')
  })
}
module.exports = authController
