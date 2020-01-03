const mongoose = require('mongoose')

// Create username schema
const userSchema = new mongoose.Schema({
  username: String, // username
  created: {
    type: String,
    default: Date.now()
  }
})

module.exports = mongoose.model('User', userSchema) // turn into 'users' db collection
