/**
* Express Modules
*/
const express = require('express')
const router = express.Router()
/**
* Mongoose Helpers
*/
const { asyncListDBCollections } = require('../../utils/helpers/mongoDB')
const { APICustomErrors } = require('../../utils/helpers/APIcustomErrors')

/**
* Exercice Tracker Middlewares
*/
const {
  validationRulesNewUser,
  validationTasksNewUser,
  validationRulesLog,
  validationTasksLog,
  validationRulesAdd,
  validationTasksAdd
} = require('../../middlewares/exercicetracker')
/**
* Mongoose Model
*/
const { User, Exercice } = require('../../models/exercicetracker') // username and exercice db model

/* POST a new user */
// @route           POST /api/exercise/new-user
// @description     submit a new user url and return an object with username and _id
router.post(
  '/new-user',
  validationRulesNewUser,
  validationTasksNewUser,
  async (req, res, next) => {
    /**
    * Working with valid posted username
    */
    try {
      // get username from request
      const username = await req.body.username
      // findOne in db
      let newUser = await User.findOne({ username })
      if (newUser) {
        // * user is found in db
        // send response to client
        res.setHeader('content-type', 'text/plain')
        res.status(400).send('username already taken')
      } else {
        // * user not found in db
        // instanciate a new User Object from mongoose schema
        newUser = new User({
          username: username,
          created: new Date()
        })
        // * save new newUser Object in db
        await newUser.save()
        // create response data
        const data = {
          username: newUser.username,
          _id: newUser._id
        }
        // send response to client
        res.status(200).json(data)
      }
    } catch (error) {
      res.setHeader('content-type', 'text/plain')
      res.status(500).send('500 INTERNAL SERVER ERROR')
    }
  })

/* GET an array of all users */
// @route           GET /api/exercise/users
// @description     return a JSON array of all users with the same info as when creating a user.
router.get('/users',
  async (req, res, next) => {
    try {
      /**
      * Working with db
      */
      // @method            db.collection.find(query, projection)
      // @collection        users
      // @description       find all users | exclude 'created' field
      // const collections = await asyncListCollections()
      const users = await User.find({}, { log: 0, count: 0, created: 0 }) // !DEV
      // check if users collections exists in db
      const dbCollections = await asyncListDBCollections()
      const isUsersCollection = dbCollections.includes('users')
      if (users && isUsersCollection) {
        // * ressource is found
        res.status(200).json(users)
      } else {
        // * ressource not found
        res.setHeader('content-type', 'text/plain')
        res.status(404).send('404 NOT FOUND')
      }
    } catch (error) {
      res.setHeader('content-type', 'text/plain')
      res.status(500).send('500 INTERNAL SERVER ERROR')
    }
  })

/* GET full exercise log by user id */
// @route           GET /api/exercise/log?userId=<ObjectId>&from=<Date>&to=<Date>&limit<Number>
// @description     I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). App will return the user object with added array log and count (total exercise count).
router.get(
  '/log',
  validationRulesLog,
  validationTasksLog,
  async (req, res) => {
    try {
    // url queries strings
      const { userId, from, to, limit } = await req.query
      // generate today date
      const [today] = new Date().toISOString().split('T')
      // * handle queries from url
      // set default date if no 'from' query is provided
      const dateFrom = typeof from === 'undefined' ? '1970-01-01T00:00:00.000Z' : `${from}T00:00:00.000Z`
      // set default date if no 'to' query is provided
      const dateTo = typeof to === 'undefined' ? `${today}T23:59:59.999Z` : `${to}T23:59:59.999Z`
      // set default limit if no 'limit' query is provided
      const limitation = typeof limit === 'undefined' ? null : limit
      // * Query DB users and find specific user by _id
      const user = await User.findOne({ _id: userId })
        .select('-created -__v') // removed fields
        .populate({
          path: 'log', // populate field
          options: {
            limit: limitation
          },
          select: { // ignored fields
            _id: 0,
            userId: 0,
            __v: 0
          },
          match: { // working with url queries
            date: { $gte: new Date(dateFrom), $lte: new Date(dateTo) }
          }
        })
        .exec()
      switch (true) {
        case user === null: // user is not found
          throw new APICustomErrors('user not found', 404, { param: 'userId', value: userId, msg: 'invalid userId' })
        default:
          // send response
          // replace count value with Array log size
          user.count = user.log.length
          res.status(200).json(user)
          break
      }
    } catch (err) {
      console.error(err.stack)
      // send error response
      switch (err.status) {
        case 404:
          res.status(404).json(err.log())
          break
        default:
          res.status(500).json(APICustomErrors.error(500))
          break
      }
    }
  })

/* POST specific user by id to add a new exercice */
// @route            POST /api/exercise/add
// @description      add new exercice to specific user by id
router.post(
  '/add',
  validationRulesAdd,
  validationTasksAdd,
  async (req, res) => {
    try {
    // get userID from request body
      const userId = req.body.userId
      // get description from request
      const description = req.body.description
      // get duration from request
      const duration = req.body.duration
      // get date from request
      const date = req.body.date
      // create new exercice object with request data
      const newExercice = await new Exercice({ userId, description, duration, date })
      // save new exercice to db
      await newExercice.save()
      console.info(`[DB][exercices][saved][id] => ${newExercice._id}`)
      // prepare content to update
      const update = { $inc: { count: 1 }, $push: { log: newExercice } }
      // find user by id then update it adding new exercice log
      const user = await User.findByIdAndUpdate(userId, update, { new: true })
        .select('-created -__v') // removed fields
        .populate({
          path: 'log', // populate field
          select: { // ignored fields
            _id: 0,
            userId: 0,
            __v: 0
          }
        })
        .exec()
      const response = {
        username: user.username,
        _id: user._id,
        description: newExercice.description,
        duration: newExercice.duration,
        date: newExercice.date
      }
      switch (true) {
        case user === null: // user is not found
          throw new APICustomErrors('user not found', 404, { value: userId, msg: 'invalid userId', param: 'userId' })
        default:
          // send response
          res.status(200).json(response)
          break
      }
    } catch (err) {
      console.error(err.stack)
      // send error response
      switch (err.status) {
        case 404:
          res.status(404).json(err.log())
          break
        default:
          res.status(500).json(APICustomErrors.error(500))
          break
      }
    }
  })

module.exports = router
