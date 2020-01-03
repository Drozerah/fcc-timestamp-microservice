/**
* Express Modules
*/
const express = require('express')
const router = express.Router()
/**
* Exercice Tracker Middlewares
*/
const { validationRules, validationTasks } = require('../../middlewares/exercicetracker')
/**
* Mongoose Model
*/
const User = require('../../models/exercicetracker') // username db model

/* POST a new user */
// @route           POST /api/exercise/new-user
// @description     submit a new user url and return an object with username and _id
router.post(
  '/new-user',
  validationRules,
  validationTasks,
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

module.exports = router
