'use strict'
const express = require('express')
const app = express()

// routes
app.use('/', require('./routes/homeRouter'))
// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
