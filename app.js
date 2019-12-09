'use strict'
const express = require('express')
const app = express()

// routes
app.use('/', (req, res) => {
  res.send('Hello Express!')
})
// listen to provided port
app.listen(3000, () => console.log('server is running on http://localhost:3000')
)
