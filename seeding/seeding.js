/**
 * Mongoose
 */
const mongoose = require('mongoose')
const connectDB = require('../config/db')
/**
* NPM modules
*/
const faker = require('faker')
// const moment = require('moment') // not installed
/**
* Mongoose Model
*/
const Seed = require('./model/seeding.model') // seedings db collection model for testing
const User = require('../models/exercicetracker') // users db collection model

/**
* Seeding with an array of documents
*/
// @method          insertMany()
const seed = function (documents) {
  // Insert Many documents
  User.insertMany(documents, { ordered: false }, (err, seedings) => {
    if (err) {
      console.log(err)
    } else {
      console.log(seedings)
      mongoose.connection.close()
      console.log('[MongoDB] connection closed!')
    }
  })
}
/**
* Run 10 cycles creates 10 users
* we use recursive function as loop
*/
const documents = []
const createDocuments = (cycle) => {
  if (cycle > 0) {
    // const date = new Date() // reference
    // const time = moment(date, 'YYYY-MM-DD HH:mm:ss').add(5, 'days').toDate()
    documents.push({
      username: faker.name.firstName(),
      created: faker.date.recent()
    })
    return createDocuments(cycle - 1)
  } else {
    console.log('Loop done!')
    // documents.reverse()
    /**
    * Start seeding
    */
    seed(documents)
  }
}
// loop(100)
// console.log(documents)

/**
* Start seeding
*/
const seeding = (iteration) => {
  // Connect to db
  connectDB()
  // Find targeted collection
  User.find((err, users) => {
    if (err) {
      console.log(err)
    } else {
      if (users.length) {
        // collection is not emtpy
        console.log('already seedings')
        mongoose.connection.close()
        console.log('[MongoDB] connection closed!')
      } else {
        // collection is empty we can start seeding it
        console.log('start seeding!')
        /**
        * Create documents
        */
        createDocuments(iteration) // create users document
      }
    }
  })
}
seeding(10) // define number of document to create the start creation
/**
* Seeding only One User
*/
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
