/**
* NPM Modules
*/
const { body, validationResult } = require('express-validator')
/**
* Exercice Tracker Middlewares
*/
const validationRules = [
  body('username')
    .exists().withMessage('undefined')
    .isLength({ min: 1 }).withMessage('undefined')
    .isLength({ max: 20 }).withMessage('gt20')
]
const validationTasks = (req, res, next) => {
  // console.log('validate user middleware') //! DEBUG
  // get validation result
  const Result = validationResult(req)
  if (!Result.isEmpty()) {
    // console.log(Result.array({ onlyFirstError: true })[0]) //! DEBUG
    const errorMessage = Result.array({ onlyFirstError: true })[0].msg
    switch (errorMessage) {
      case 'undefined':
        // console.log(errorMessage) //! DEBUG
        res.setHeader('content-type', 'text/plain')
        res.status(400).send('`username` is required.')
        break
      case 'gt20':
        // console.log(errorMessage) //! DEBUG
        res.setHeader('content-type', 'text/plain')
        res.status(400).send('username too long')
        break
    }
  } else {
    next()
  }
}

module.exports = { validationRules, validationTasks }
