// Express
const express = require('express')
const router = express.Router()

// Express validator
const { param, validationResult } = require('express-validator')

/**
* validation rules for 'date_string' parameter
*/
const validationRules = [
  param('date_string')
    .exists().withMessage('undefined')
    .bail()
    .isLength({ min: 1, max: 16 }).withMessage('isInvalidLength')
    .bail()
    .not().isISO8601().withMessage('isISO8601')
    .not().isInt().withMessage('isTimeStamp')
]

/**
* validation tasks
*/
const validationTasks = (req, res, next) => {
  // create Api response Object int req.locals Object
  req.locals = {
    apiResponse: {}
  }
  // respond with unix and utc formats
  const apiResponse = time => {
    req.locals.apiResponse.unix = time.getTime() // unix
    req.locals.apiResponse.utc = time.toUTCString() // UTC
  }
  // respond with an error message
  const apiResponseError = () => { req.locals.apiResponse.error = 'Invalid Date' }

  // get validation result Object
  const ResultObj = validationResult(req)

  // working with validation messages and values
  if (ResultObj.isEmpty()) {
    //  by default, if the validation returns no message
    //    it means that we have an error with the parameter
    apiResponseError()
  } else {
    // get values from Result Object
    const [result] = ResultObj.errors // get first result in Object
    const message = result.msg // validation message
    const value = result.value // validation value
    switch (message) {
      case 'undefined': // parameter is undefined (empty)
        apiResponse(new Date())
        break
      case 'isISO8601': // parameter is compliant with ISO-8601
        apiResponse(new Date(value))
        break
      case 'isTimeStamp': // parameter is a valid timestamp
        apiResponse(new Date(Number(value)))
        break
      case 'isInvalidLength': // parameter is badly formatted
        apiResponseError()
        break
    }
  }
  next()
}

/* GET timestamp. */
router.get(
  '/:date_string?', // optional parameter
  validationRules,
  validationTasks,
  (req, res, next) => res.json(req.locals.apiResponse)
)

module.exports = router
