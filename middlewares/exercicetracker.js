/**
* NPM Modules
*/
const { body, query, validationResult } = require('express-validator')
/**
* Mongoose Helpers
*/
const { TypesObjectIdisValid } = require('../utils/helpers/mongoDB')
const { APICustomErrors } = require('../utils/helpers/APIcustomErrors')
const { User } = require('../models/exercicetracker') // username and exercice db model

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
  // * get validation results
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
/**
* Validate URL query parameters for GET /api/exercise/add route
*
* @description     URL parameters validation
* @route           GET /api/exercise/add
*/
const validationRulesAdd = [
  body('userId')
    .exists().withMessage('parameter is required')
    .bail()
    .custom(value => TypesObjectIdisValid(value) === true).withMessage('invalid value')
    .bail()
    .custom(async value => {
      const user = await User.exists({ _id: value })
      if (!user) {
        return Promise.reject(user)
      }
    }).withMessage('invalid value'),
  body('description')
    .exists().withMessage('parameter is required')
    .bail()
    .isLength({ min: 3 }).withMessage('parameter must be at least 3 characters long')
    .isLength({ max: 20 }).withMessage('parameter value maximum length is 20 characters'),
  body('duration')
    .exists().withMessage('parameter is required')
    .bail()
    .isNumeric().withMessage('parameter must be a numeric value')
    .bail()
    .custom(value => {
      console.log(typeof value)
      if (Number(value) < 1 || Number(value) > 1440) {
        return false
      } else {
        return true
      }
    }).withMessage('parameter must be a number between 1 and 1440')
]
const validationTasksAdd = async (req, res, next) => {
  // * get validation result
  const Result = await validationResult(req)
  if (!Result.isEmpty()) {
    // console.log(Result.array({ onlyFirstError: true })[0]) //! DEBUG
    // eslint-disable-next-line dot-notation
    // console.log(Result['errors']) //! DEBUG
    const response = APICustomErrors.assign(400)
    response.details = []
    // eslint-disable-next-line dot-notation
    Result['errors'].forEach(element => {
      const obj = {}
      obj.value = typeof element.value === 'undefined' ? 'undefined' : element.value
      obj.msg = element.msg
      obj.param = element.param
      // validation.details.push(obj)
      response.details.push(obj)
    })
    // console.log(response) //! DEBUG
    res.status(response.error.code).json(response)
  } else {
    next()
  }
}
module.exports = {
  validationRulesNewUser,
  validationTasksNewUser,
  validationRulesLog,
  validationTasksLog,
  validationRulesAdd,
  validationTasksAdd
}
