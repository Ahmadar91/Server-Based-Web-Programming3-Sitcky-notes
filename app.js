'use strict'
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const app = express()
const mongoose = require('./config/mongoose')
const MongoDBStore = require('connect-mongodb-session')(session)
const csrf = require('csurf')

const store = new MongoDBStore({
  uri: 'mongodb+srv://dbuser:nqrMG2AjFViHjNQS@uniprojects-jbhjp.mongodb.net/snippets?retryWrites=true&w=majority',
  collection: 'sessions'
})
const csrfProtection = csrf()
// connect to the database
mongoose.connect().catch(error => {
  console.error(error)
  process.exit(1)
})
// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default'),
  partialsDir: path.join(__dirname, 'views', 'partials')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(logger('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
// setup and use session middleware (https://github.com/expressjs/session)
const sessionOptions = {
  name: 'name of keyboard cat', // Don't use default session cookie name.
  secret: 'keyboard cat', // Change it!!! The secret is used to hash the session with HMAC.
  resave: false, // Resave even if a request is not changing the session.
  saveUninitialized: false, // Don't save a created but not modified session.
  store: store,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 1 day
  }
}
app.use(session(sessionOptions))
app.use(csrfProtection)
// middleware to be executed before the routes
app.use((req, res, next) => {
  // flash messages - survives only a round trip
  if (req.session.flash) {
    res.locals.flash = req.session.flash
    delete req.session.flash
  }

  next()
})

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn
  res.locals.csrfToken = req.csrfToken()
  next()
})

// routes
app.use(require('./routes/authRouter'))
app.use('/', require('./routes/homeRouter'))
app.use('/snippet', require('./routes/snippetRouter'))

// catch 404
app.use((req, res, next) => {
  res.status(404)
  res.sendFile(path.join(__dirname, 'public', '404.html'))
})
// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.sendFile(path.join(__dirname, 'public', '500.html'))
})

// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
