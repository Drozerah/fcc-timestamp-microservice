require('dotenv').config()
const mongoose = require('mongoose')
// Get MongoDB URI from env variable
const db = process.env.MONGODB

// Connect to db
const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false // https://mongoosejs.com/docs/deprecations.html#-findandmodify-
    })
    if (process.env.NODE_ENV !== 'test') {
      console.log('[MongoDB] Connected...')
    }
  } catch (error) {
    console.error('[MongoDB] Connection Failed !')
    console.error(error.message)
    process.exit(1)
  }
}

module.exports = connectDB
