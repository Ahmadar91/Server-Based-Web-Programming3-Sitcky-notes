
'use strict'

const mongoose = require('mongoose')

// Create a schema.
const codeSnippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  }
}, {
  timestamps: true
})

// Create a model using the schema.
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema)

// Exports.
module.exports = CodeSnippet
