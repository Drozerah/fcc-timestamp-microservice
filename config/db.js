require('dotenv').config()
const mongoose = require('mongoose')
// Get MongoDB URI from env variable
const db = process.env.MONGODB

// Connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    if (process.env.NODE_ENV !== 'test') {
      console.log('MongoDB Connected...')
    }
  } catch (error) {
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
