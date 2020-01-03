require('dotenv').config()
/**
* Mongoose Helpers
*/
const mongoose = require('mongoose')
/**
 * Async list collections registered via mongoose.model
 *
 * @returns {Array} Async mongoose registered collections
 */
const asyncListMongooseCollections = () => {
  return new Promise((resolve, reject) => {
    const dbCollections = []
    const collections = mongoose.connections[0].collections
    // console.log(collections)
    if (collections) {
      Object.keys(collections).forEach(collection => dbCollections.push(collection))
      return resolve(dbCollections)
    } else {
      const err = 'error listing mongoose collections'
      return reject(err)
    }
  })
}
/**
 * List collections registered via mongoose.model
 *
 * @returns {Array} mongoose registered collections
 */
const ListMongooseCollections = () => {
  const dbCollections = []
  const collections = mongoose.connections[0].collections
  Object.keys(collections).forEach(collection => dbCollections.push(collection))
  if (collections) {
    return dbCollections
  } else {
    const err = 'error listing mongoose collections'
    console.error(err)
    return []
  }
}

module.exports = {
  ListMongooseCollections,
  asyncListMongooseCollections
}
