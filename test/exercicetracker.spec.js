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
