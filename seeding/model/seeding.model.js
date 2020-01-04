const mongoose = require('mongoose')

// Create username schema
const seedingSchema = new mongoose.Schema({
  username: String, // username
  created: {
    type: String,
    default: Date.now()
  }
})

module.exports = mongoose.model('Seeding', seedingSchema) // turn into 'seedings' db collection
