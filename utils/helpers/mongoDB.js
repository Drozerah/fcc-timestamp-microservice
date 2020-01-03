require('dotenv').config()
/**
* MongoDB Helpers
*/
const mongoose = require('mongoose')
// Get MongoDB URI from env variable
const db = process.env.MONGODB

/**
* Array of all collections from db
*
* @returns {Array} an array of db collections
*/
const ListDBCollections = () => {
  const result = []
  const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  return mongoose.connect(db, config, (err, client) => {
    if (err) {
      console.error(err)
      return err
    }
    return client.db.listCollections().toArray((err, collections) => {
      if (err) {
        console.error(err)
        return err
      } else {
        collections.forEach(collection => result.push(collection.name))
        return result
      }
    })
  })
}

/**
* Async Array of all collections from db
*
* @returns {Array} an array of db collections
*/
const asyncListDBCollections = () => {
  const result = []
  const config = {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  return new Promise((resolve, reject) => {
    return mongoose.connect(db, config, (err, client) => {
      if (err) {
        return reject(err)
      } else {
        return client.db.listCollections().toArray((err, collections) => {
          if (err) {
            return reject(err)
          } else {
            collections.forEach(collection => result.push(collection.name))
            return resolve(result)
          }
        })
      }
    })
  })
}

module.exports = {
  ListDBCollections,
  asyncListDBCollections
}
