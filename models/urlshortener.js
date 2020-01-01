const mongoose = require('mongoose')

// Create URL schema
const urlSchema = new mongoose.Schema({
  originalUrl: String, // original url
  shortUrlId: String, // short url id ex: LghyMGk8
  baseUrl: String, // /api/shorturl
  appUrl: String, // http://localhost:3000/
  shortUrl: String, // http://localhost:3000/api/shorturl/LghyMGk8,
  views: {
    type: Number,
    default: 0
  },
  date: {
    type: String,
    default: Date.now()
  }
})

module.exports = mongoose.model('ShortUrl', urlSchema) // turn into 'shorturls' db collection
