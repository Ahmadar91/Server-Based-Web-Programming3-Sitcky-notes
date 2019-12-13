const homeController = {}
const CodeSnippet = require('../models/CodeSnippet')

homeController.index = async (req, res, next) => {
  try {
    const viewData = {
      codeSnippets: (await CodeSnippet.find({}))
        .map(codeSnippet => ({
          id: codeSnippet._id,
          title:codeSnippet.title,
          name: codeSnippet.name,
          description: codeSnippet.description
        }))
    }
    res.render('home/index', { viewData })
  } catch (error) {
    next(error)
  }
}
module.exports = homeController
