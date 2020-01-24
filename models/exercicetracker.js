const mongoose = require('mongoose')

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

const Exercice = mongoose.model('Exercice', exerciceSchema) // turn into 'commandes' db collection

module.exports = { User, Exercice } // turn into 'users' db collection
