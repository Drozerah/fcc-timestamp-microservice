/**
 * Mongoose
 */
const mongoose = require('mongoose')
const connectDB = require('../config/db')
/**
* NPM modules
*/
const faker = require('faker')
// const moment = require('moment') // ? not installed!
/**
* Mongoose Model
*/
const Seed = require('./model/seeding.model') // seedings db collection model for testing
const User = require('../models/exercicetracker') // users db collection model
/**
* Array of documents
*/
const documents = []
/**
* Insert an Array of documents in collection
*
* @param {Array} documents the array of documents
* @returns {Function} callback where db connection is closed after transaction
*/
const insertDocuments = (documents) => {
  // Insert Many documents
  // @descritption    insert many dynamically created documents in db at once
  // @method          .insertMany()
  User.insertMany(documents, { ordered: false }, (err, docs) => {
    // callBack
    if (err) {
      console.log(err)
    } else {
      console.log(docs)
      mongoose.connection.close()
      console.log('[MongoDB] connection closed!')
    }
  })
}
/**
* Fill an Array of documents to insert in db
*
* we use Faker.js to generate data

* we use recursive function as loop where the cycle
* param correponds of the number of iterations we want to execute
*
* @param {Number} iteration corresponds to the number of documents to create
* @returns {Function} function call insertDocuments()
*/
const createDocuments = (cycle) => {
  if (cycle > 0) {
    // const date = new Date() // reference
    // const time = moment(date, 'YYYY-MM-DD HH:mm:ss').add(5, 'days').toDate()
    documents.push({
      username: faker.name.firstName(), // add firstName
      created: faker.date.recent() // add recent date
    })
    return createDocuments(cycle - 1)
  } else {
    console.log('Loop done!')
    // documents.reverse() // reverse array order
    /**
    * Start seeding
    */
    insertDocuments(documents)
  }
}
// createDocuments(100)
// console.log(documents)

/**
 * Seed db collection
 *
 * @param {Number} iteration corresponds to the number of documents to create
 */
const seeding = (iteration) => {
  // Connect to db
  connectDB()
  // Find targeted collection
  User.find((err, users) => {
    if (err) {
      console.log(err)
    } else {
      // Check id the collection is empty first
      if (users.length) {
        // collection is not emtpy
        console.log('[MongoDB] already seeded!')
        mongoose.connection.close()
        console.log('[MongoDB] connection closed!')
      } else {
        // collection is empty we can start seeding it
        console.log('start seeding!')
        /**
        * Create documents
        */
        // @description         call createDocuments function
        // @method              createDocuments()
        createDocuments(iteration) // create users document
      }
    }
  })
}
seeding(10) // start

/**
* Seeding only One User
*/
// @description         insert one document in db
// @method              .save()
// eslint-disable-next-line no-unused-vars
const seedingOne = () => {
  User.find((err, seedings) => {
    if (err) {
      console.log(err)
    } else {
      if (seedings.length) {
        mongoose.connection.close()
        console.log('connection closed already seedings')
      } else {
        const obj = {
          username: 'drozerah',
          created: new Date()
        }
        new Seed(obj).save()
          .then(() => mongoose.connection.close())
          .then(() => console.log('connection closed'))
      }
    }
  })
}
// seedingOne()
