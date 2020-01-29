/* eslint-disable no-undef */
/**
* Babel
*/
require('@babel/polyfill')
const app = require('../app')
const request = require('supertest')
/**
* Specifications
*/
// ? [x] It should handle an empty date parameter, and return the current time in unix format
// ? [x] It should handle an empty date parameter, and return the current time in UTC format
// ? [x] It should return the expected error message for an invalid date
// ? [x] It should handle a valid unix date, and return the correct unix timestamp
// ? [x] It should handle a valid date, and return the correct UTC string
// ? [x] It should handle a valid date, and return the correct unix timestamp

describe('Test API route /api/timestamp', () => {
  it('It should handle an empty date parameter, and return the current time in unix format', (done) => {
    request(app)
      .get('/api/timestamp')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        // we use the response header date as current time
        const currentTime = new Date(response.header.date).toISOString().substring(0, 10)
        const resTime = new Date(response.body.unix).toISOString().substring(0, 10)
        if (resTime === currentTime) {
          done()
        } else {
          const e = 'Invalid Date'
          done(e)
        }
      })
  })
  it('It should handle an empty date parameter, and return the current time in UTC format', (done) => {
    request(app)
      .get('/api/timestamp')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const currentTime = new Date(response.header.date).toISOString().substring(0, 10)
        const resTime = new Date(response.body.utc).toISOString().substring(0, 10)
        if (resTime === currentTime) {
          done()
        } else {
          const e = 'Invalid Date'
          done(e)
        }
      })
  })
  // generate invalid date string
  const InvalidDate = 'invalid_date_parameter'
  it('It should return the expected error message for an invalid date', (done) => {
    request(app)
      .get(`/api/timestamp/${InvalidDate}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .expect({ error: 'Invalid Date' })
      .end((err, res) => {
        if (err) done(err)
        done()
      })
  })
  // generate a new unix date from now
  const validUnixDate = new Date().getTime()
  it('It should handle a valid unix date, and return the correct unix timestamp', (done) => {
    request(app)
      .get(`/api/timestamp/${validUnixDate}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if (response.body.unix === validUnixDate) {
          done()
        } else {
          const e = 'Invalid Date'
          done(e)
        }
      })
  })
  // generate a new valide date like string ex: 2019-12-25
  const validDate = new Date().toISOString().substring(0, 10)
  it('It should handle a valid date, and return the correct UTC string', (done) => {
    request(app)
      .get(`/api/timestamp/${validDate}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const reqUTC = new Date(validDate).toUTCString()
        if (response.body.utc === reqUTC) {
          done()
        } else {
          const e = 'Invalid Date'
          done(e)
        }
      })
  })
  it('It should handle a valid date, and return the correct unix timestamp', (done) => {
    request(app)
      .get(`/api/timestamp/${validDate}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        const reqUnix = new Date(validDate).getTime()
        if (response.body.unix === reqUnix) {
          done()
        } else {
          const e = 'Invalid Date'
          done(e)
        }
      })
  })
})
