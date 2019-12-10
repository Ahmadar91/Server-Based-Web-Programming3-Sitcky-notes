'use strict'
const express = require('express')
const hbs = require('express-hbs')
const path = require('path')

const app = express()

// view engine setup
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views', 'layouts', 'default')
}))
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))
// additional middleware
app.use(express.static(path.join(__dirname, 'public')))
// routes
app.use('/', require('./routes/homeRouter'))
// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
