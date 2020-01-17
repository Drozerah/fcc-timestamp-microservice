/* eslint-disable no-undef */
/**
* Babel
*/
require('@babel/polyfill')
/**
* Express
*/
const app = require('../app')
/**
* NPM dependency
*/
const request = require('supertest')
const shortid = require('shortid')
/**
* Debug
*/
console.log(`[APP-MODE] ${app.get('env')}`)
/**
* Settings
*/
// put your variables here
const fakeUserName = `test-${shortid.generate()}`
/**
* Specifications
*/
// FCC tests
// ? [x] I can create a user by posting form data username to /api/exercise/new-user and returned will be an object with username and _id.
describe('Test API route /api/exercise/new-user', () => {
  // no data attached to request
  it('No data : expect 400 status code - Content-Type Text - response "`username` is required."', (done) => {
    request(app)
      .post('/api/exercise/new-user')
      .expect('Content-Type', /text/)
      .expect(400, '`username` is required.')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  // username min length is 1 character
  it('Username min length : expect 400 status code - Content-Type Text - response "`username` is required."', (done) => {
    request(app)
      .post('/api/exercise/new-user')
      .send({ username: '' })
      .expect('Content-Type', /text/)
      .expect(400, '`username` is required.')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  // user name max lenght is 20 characters
  it('Username max length : expect 400 status code - Content-Type Text - response "username too long"', (done) => {
    request(app)
      .post('/api/exercise/new-user')
      .send({ username: 'azertyuiopqsdfghjklmw' })
      .expect('Content-Type', /text/)
      .expect(400, 'username too long')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  // create valid user
  it(`Create valid user : expect 200 status code - Content-Type JSON - response {"username":"${fakeUserName},"_id":"xxxxxxx"}"`, (done) => {
    request(app)
      .post('/api/exercise/new-user')
      .send({ username: fakeUserName })
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  // username already taken
  it('Username already taken : expect 400 status code - Content-Type Text - response "username already taken"', (done) => {
    request(app)
      .post('/api/exercise/new-user')
      .send({ username: fakeUserName })
      .expect('Content-Type', /text/)
      .expect(400, 'username already taken')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
/**
* Specifications
*/
// FCC tests
// ? [x] I can get an array of all users by getting api/exercise/users with the same info as when creating a user.
describe('Test API route /api/exercice/users', () => {
  // all users
  it('Get Array of all users - expect 200 status code - users have "_id" & "username" properties', (done) => {
    request(app)
      .get('/api/exercise/users')
      .expect(200)
      .then(response => {
        const data = response.body
        const isArray = Array.isArray(data) // boolean
        // eslint-disable-next-line no-prototype-builtins
        const everyHasPropId = data.every(user => user.hasOwnProperty('_id')) // boolean
        // eslint-disable-next-line no-prototype-builtins
        const everyHasPropUsername = data.every(user => user.hasOwnProperty('username')) // boolean
        if (response && isArray && everyHasPropId && everyHasPropUsername) {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
})
/**
* Specifications
*/
// FCC test
// ? [ ] I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. App will return the user object with the exercise fields added.
describe('Test API route /api/exercise/add', () => {
  // Add an exercice to user by id
  it('expect 200 status code', (done) => {
    request(app)
      .post('/api/exercise/add')
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
})
/**
* Specifications
*/
// Custom test
// ? [x] return 400 bad request with no userId param
describe('Test API route /api/exercise/log with no userId param', () => {
  it('expect 400 status code with "400 BAD REQUEST" text', (done) => {
    request(app)
      .get('/api/exercise/log')
      .expect('Content-Type', /text/)
      .expect(400, '400 BAD REQUEST')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
/**
* Specifications
*/
// Custom test
// ? [x] return 400 bad request with invalid mongoose Object Id
const invalidUserId = '5e208d3bbc010f2'
describe(`Test API route /api/exercise/log?userId=${invalidUserId} with invalid mongoose Object Id`, () => {
  it('expect 400 status code with "400 BAD REQUEST" text', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${invalidUserId}`)
      .expect('Content-Type', /text/)
      .expect(400, '400 BAD REQUEST')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
/**
* Specifications
*/
// Custom test
// ? [x] return 404 NOT FOUND with valid Id but no matching result
const validUserIdNotFound = '5d3350fe14e97100799394f5'
describe(`Test API route /api/exercise/log?userId=${validUserIdNotFound} with valid Id but no matching result`, () => {
  it('expect 404 status code with "404 NOT FOUND" text', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserIdNotFound}`)
      .expect(404, '404 NOT FOUND')
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
/**
* Specifications
*/
// FCC test
// ? [ ] I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). App will return the user object with added array log and count (total exercise count)
const validUserId = '5e10026dc091e32a58d9f9dc'
describe(`Test API route /api/exercise/log?userId=${validUserId}`, () => {
  // Add an exercice to user by id
  it('`~~~~~~~expect 200 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}`)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
})
