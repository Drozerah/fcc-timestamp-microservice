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
* Specifications FCC
*/
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
* Specifications FCC
*/
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
* Specifications FCC
*/
// ? [x] I can retrieve a full exercise log of any user by getting /api/exercise/log with a parameter of userId(_id). App will return the user object with added array log and count (total exercise count)
const validUserId = '5e28bab0061787431496b0f7'
const validUserIdNotFound = '5d3350fe14e97100799394f5'
const invalidUserId = '5e208d3bbc010f2'
const validFromParam = '2020-01-01'
const invalidFromParam = '20-01-1930'
const validToParam = '2020-01-31'
const invalidToParam = '20-01-1990'
const validlimit = 2
const invalidlimit = 1000
const invalidlimitType = '${}kjh'
describe('Test API route /api/exercise/log?userId=<userId>&from=<Date>&to=<Date>&limit=<Number>', () => {
  it(`[valid][UserId] parameter expect response._id equal to the tested valid userId ${validUserId}`, (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if (response.body._id === validUserId) {
          done()
        } else {
          done(err)
        }
      })
  })
  it('[valid][UserId][no matching] expect 404 status code with "404 NOT FOUND" text', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserIdNotFound}`)
      .expect(404)
      .then(response => {
        if (response.body.error.status === '404 NOT FOUND') {
          done()
        } else {
          done(err)
        }
      })
  })
  it('[invalid][UserId] expect 400 status code with "400 BAD REQUEST" as response.body.error.status and "invalid value" as response.body.details[0].msg', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${invalidUserId}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.error.status === '400 BAD REQUEST' &&
        response.body.details[0].msg === 'invalid value') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[invalid-empty][UserId] expect 400 status code with "400 BAD REQUEST" as response.body.error.status and "parameter is required" as response.body.details[0].msg', (done) => {
    request(app)
      .get('/api/exercise/log')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.error.status === '400 BAD REQUEST' &&
        response.body.details[0].msg === 'parameter is required') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[valid][from] parameter expect 200 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&from=${validFromParam}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('[invalid][from] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&from=${invalidFromParam}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('[invalid-empty][from] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&from`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('[valid][to] parameter expect 200 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&to=${validToParam}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('[invalid][to] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&to=${invalidToParam}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.details[0].param === 'to') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[invalid-empty][from] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&to`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.details[0].param === 'to') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[valid][limit] parameter expect 200 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&limit=${validlimit}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('[invalid][limit] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&limit=${invalidlimit}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.details[0].param === 'limit') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[invalid-type][limit] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&limit=${invalidlimitType}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.details[0].param === 'limit') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[invalid-empty][limit] parameter expect 400 status code', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&limit`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.details[0].param === 'limit') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  it('[valid] full request expect 200 status code and response', (done) => {
    request(app)
      .get(`/api/exercise/log?userId=${validUserId}&from=${validFromParam}&to=${validToParam}&limit=${validlimit}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if (
          response.body.count === validlimit &&
          response.body.log.length === response.body.count &&
          response.body.username &&
          response.body._id === validUserId &&
          response.body.log[0].description &&
          response.body.log[0].duration &&
          response.body.log[0].date) {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
})

/**
* Specifications FCC
*/
// ? [ ] I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. App will return the user object with the exercise fields added.
// describe('Test API route /api/exercise/add', () => {
//   // Add an exercice to user by id
//   it('>>>>>>> expect 200 status code', (done) => {
//     request(app)
//       .patch('/api/exercise/add')
//       .expect(200)
//       .end((err, res) => {
//         if (err) {
//           done(err)
//         } else {
//           done()
//         }
//       })
//   })
// })
