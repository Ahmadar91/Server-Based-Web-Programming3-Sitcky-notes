
'use strict'

const CodeSnippet = require('../models/CodeSnippet')

const snippetController = {}

/**
 * index GET
 */
snippetController.index = async (req, res, next) => {
  try {
    if (req.session.user) {
      const viewData = {
        codeSnippets: (await CodeSnippet.find({ name: req.session.user.name }))
          .map(codeSnippet => ({
            id: codeSnippet._id,
            title: codeSnippet.title,
            description: codeSnippet.description
          }))
      }
      res.render('snippet/index', { viewData })
    } else {
      res.send(403, 'access Forbidden')
    }
  } catch (error) {
    next(error)
  }
}

/**
 * create GET
 */
snippetController.create = async (req, res, next) => {
  if (req.session.user) {
    const viewData = {
      title: '',
      description: ''
    }
    res.render('snippet/create', { viewData })
  } else {
    res.send(403, 'access Forbidden')
  }
}

/**
 * create POST
 */
snippetController.createPost = async (req, res, next) => {
  try {
    const codeSnippet = new CodeSnippet({
      title: req.body.title,
      description: req.body.description,
      name: req.session.user.name
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
    if (req.session.user) {
      const codeSnippet = await CodeSnippet.findOne({ _id: req.params.id })
      if (codeSnippet.name === req.session.user.name) {
        const viewData = {
          id: codeSnippet._id,
          title: codeSnippet.title,
          description: codeSnippet.description
        }
        res.render('snippet/edit', { viewData })
      } else {
        req.session.flash = { type: 'danger', text: 'Invalid User' }
        res.redirect('/')
      }
    } else {
      res.send(403, 'access Forbidden')
    }
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
    const codeSnippet = await CodeSnippet.findOne({ _id: req.body.id })
    if (codeSnippet.name === req.session.user.name) {
      const result = await CodeSnippet.updateOne({ _id: codeSnippet.id }, {
        title: req.body.title,
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
    } else {
      req.session.flash = { type: 'danger', text: 'Invalid User' }
      res.redirect(`./edit/${req.body.id}`)
    }
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
    if (req.session.user) {
      const codeSnippet = await CodeSnippet.findOne({ _id: req.params.id })
      if (codeSnippet.name === req.session.user.name) {
        const viewData = {
          id: codeSnippet._id,
          title: codeSnippet.title,
          description: codeSnippet.description
        }
        res.render('snippet/delete', { viewData })
      } else {
        req.session.flash = { type: 'danger', text: 'Invalid User' }
        res.redirect('/')
      }
    } else {
      res.send(403, 'access Forbidden')
    }
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
    const codeSnippet = await CodeSnippet.findOne({ _id: req.body.id })
    if (codeSnippet.name === req.session.user.name) {
      await CodeSnippet.deleteOne({ _id: codeSnippet.id })
      req.session.flash = { type: 'success', text: 'code-snippet was removed successfully.' }
      res.redirect('.')
    } else {
      req.session.flash = { type: 'danger', text: 'Invalid USer' }
      res.redirect(`./delete/${req.body.id}`)
    }
  } catch (error) {
    req.session.flash = { type: 'danger', text: error.message }
    req.redirect(`./delete/${req.body.id}`)
  }
}

// Exports.
module.exports = snippetController
