/**
* NPM Modules
*/
const { body, query, validationResult } = require('express-validator')
/**
* Mongoose Helpers
*/
const { TypesObjectIdisValid } = require('../utils/helpers/mongoDB')

/**
* Validate request parameters for POST /api/exercise/new-user route
*
* @description     req.body parameters validation
* @route           POST /api/exercise/new-user
*/
const validationRulesNewUser = [
  body('username')
    .exists().withMessage('undefined')
    .isLength({ min: 1 }).withMessage('undefined')
    .isLength({ max: 20 }).withMessage('gt20')
]
const validationTasksNewUser = (req, res, next) => {
  // console.log('validate user middleware') //! DEBUG
  // * get validation result
  const Result = validationResult(req)
  if (!Result.isEmpty()) {
    // console.log(Result.array({ onlyFirstError: true })[0]) //! DEBUG
    const errorMessage = Result.array({ onlyFirstError: true })[0].msg
    // set header
    res.setHeader('content-type', 'text/plain')
    switch (errorMessage) {
      case 'undefined':
        // console.log(errorMessage) //! DEBUG
        res.status(400).send('`username` is required.')
        break
      case 'gt20':
        // console.log(errorMessage) //! DEBUG
        res.status(400).send('username too long')
        break
    }
  } else {
    next()
  }
}
/**
* Validate URL query parameters for GET /api/exercise/log route
*
* @description     URL parameters validation
* @route           GET /api/exercise/log?userId=<ObjectId>&from=<Date>&to=<Date>&limit<Number>
*/
const validationRulesLog = [
  query('userId')
    .exists().withMessage('parameter is required')
    .bail()
    .custom(value => TypesObjectIdisValid(value) === true).withMessage('invalid value'),
  query('limit')
    .optional({ nullable: true })
    .isNumeric().withMessage('parameter must be a numeric value')
    .bail()
    .isLength({ min: 1 }).withMessage('parameter must be at least 1 number')
    .isLength({ max: 3 }).withMessage('parameter maximum value is 999'),
  query('from')
    .optional({ nullable: true })
    .not().isEmpty().withMessage('parameter can not be empty')
    .bail()
    .isISO8601().withMessage('invalid \'from\' parameter - must be ISO 8601 compliant'),
  query('to')
    .optional({ nullable: true })
    .not().isEmpty().withMessage('parameter can not be empty')
    .bail()
    .isISO8601().withMessage('invalid \'to\' parameter - must be ISO 8601 compliant')
]
const validationTasksLog = (req, res, next) => {
  // console.log('validate user middleware') //! DEBUG
  // * get validation result
  const Result = validationResult(req)
  if (!Result.isEmpty()) {
    // console.log(Result.array({ onlyFirstError: true })[0]) //! DEBUG
    const validation = {
      error: {
        status: '400 BAD REQUEST',
        code: 400
      },
      details: []
    }
    // console.log(Result['errors']) //! DEBUG
    // eslint-disable-next-line dot-notation
    Result['errors'].forEach(element => {
      const obj = {}
      obj.param = element.param
      obj.msg = element.msg
      obj.value = typeof element.value === 'undefined' ? 'undefined' : element.value
      validation.details.push(obj)
    })
    res.status(validation.error.code).json(validation)
  } else {
    next()
  }
}
module.exports = {
  validationRulesNewUser,
  validationTasksNewUser,
  validationRulesLog,
  validationTasksLog
}
