
'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create a schema.
const codeSnippetSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 1
  },
  name: {
    type: Schema.Types.String,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

// Create a model using the schema.
const CodeSnippet = mongoose.model('CodeSnippet', codeSnippetSchema)

// Exports.
module.exports = CodeSnippet
