
'use strict'

const CodeSnippet = require('../models/CodeSnippet')

const snippetController = {}

/**
 * index GET
 */
snippetController.index = async (req, res, next) => {
  try {
    const viewData = {
      codeSnippets: (await CodeSnippet.find({}))
        .map(codeSnippet => ({
          id: codeSnippet._id,
          description: codeSnippet.description
        }))
    }
    res.render('snippet/index', { viewData })
  } catch (error) {
    next(error)
  }
}

/**
 * create GET
 */
snippetController.create = async (req, res, next) => {
  const viewData = {
    description: ''
  }
  res.render('snippet/create', { viewData })
}

/**
 * create POST
 */
snippetController.createPost = async (req, res, next) => {
  try {
    const codeSnippet = new CodeSnippet({
      description: req.body.description
    })

    await codeSnippet.save()

    req.session.flash = { type: 'success', text: 'code-snippet was created successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('./create')
  }
}

/**
 * edit GET
 */
snippetController.edit = async (req, res, next) => {
  try {
    const codeSnippet = await CodeSnippet.findOne({ _id: req.params.id })
    const viewData = {
      id: codeSnippet._id,
      description: codeSnippet.description
    }
    res.render('snippet/edit', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 * edit POST
 */
snippetController.editPost = async (req, res, next) => {
  try {
    const result = await CodeSnippet.updateOne({ _id: req.body.id }, {
      description: req.body.description
    })

    if (result.nModified === 1) {
      req.session.flash = { type: 'success', text: 'code-snippet was updated successfully.' }
    } else {
      req.session.flash = {
        type: 'danger',
        text: 'The code-snippet you attempted to update was removed by another user after you got the original values.'
      }
    }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect(`./edit/${req.body.id}`)
  }
}

/**
 * delete GET
 */
snippetController.delete = async (req, res, next) => {
  try {
    const codeSnippet = await CodeSnippet.findOne({ _id: req.params.id })
    const viewData = {
      id: codeSnippet._id,
      description: codeSnippet.description
    }
    res.render('snippet/delete', { viewData })
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    res.redirect('.')
  }
}

/**
 * delete POST
 */
snippetController.deletePost = async (req, res, next) => {
  try {
    await CodeSnippet.deleteOne({ _id: req.body.id })

    req.session.flash = { type: 'success', text: 'code-snippet was removed successfully.' }
    res.redirect('.')
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

// Exports.
module.exports = snippetController
