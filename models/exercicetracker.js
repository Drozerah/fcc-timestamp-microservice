const mongoose = require('mongoose')
// const { APICustomErrors } = require('../utils/helpers/APIcustomErrors')

// Create username schema
const userSchema = new mongoose.Schema({
  username: String, // username
  created: {
    type: Date,
    default: Date.now
  },
  count: {
    type: Number,
    default: 0
  },
  log: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercice'
  }]
})

/**
 * Mongoose virtual getter to expose the user log array length
 *
 * @returns {Number} the length of the log Array
 */
userSchema.virtual('userVirtualLogCounter').get(function () {
  if (this.log != null) {
    return this.log.length
  }
})
const User = mongoose.model('User', userSchema)

// create commande schema
const exerciceSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

/**
*  exercice pre middleware on save action
*/
// exerciceSchema.pre('save', async function (next) {
//   console.log(`[mongoose][pre][save][document] => ${this._id}`)
//   // console.log(this) //! debug
//   // console.log(this.userId) //! debug
//   // check if user exists in db
//   const user = await User.exists({ _id: this.userId })
//   // console.log('pre user =>', user) //! debug
//   if (user) {
//     next()
//   } else {
//     console.log(`[mongoose][pre][save][abort saving document] => ${this._id}`)
//     throw new APICustomErrors('user not found', 404, { value: this.userId, msg: 'invalid userId', param: 'userId' })
//   }
// })
const Exercice = mongoose.model('Exercice', exerciceSchema) // turn into 'commandes' db collection

module.exports = { User, Exercice } // turn into 'users' db collection
