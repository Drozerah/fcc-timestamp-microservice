/* eslint-disable camelcase */
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
const validUserId = '5e31c80ce1cb0c25243ad998'
const validUserName = 'test-A3ymRjYh'
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
// ? [x] I can add an exercise to any user by posting form data userId(_id), description, duration, and optionally date to /api/exercise/add. If no date supplied it will use current date. App will return the user object with the exercise fields added.
const expected_response_1 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'userId'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_2 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_3 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidUserId,
      msg: 'invalid value',
      param: 'userId'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_4 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: validUserIdNotFound,
      msg: 'invalid value',
      param: 'userId'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_5 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: '',
      msg: 'parameter must be at least 3 characters long',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_6 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: 'a',
      msg: 'parameter must be at least 3 characters long',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const tooLongDescription = 'azertyuiopqsdfghjklmw'
const expected_response_7 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: tooLongDescription,
      msg: 'parameter value maximum length is 20 characters',
      param: 'description'
    },
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const validDescription = 'valid description'
const expected_response_8 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: 'undefined',
      msg: 'parameter is required',
      param: 'duration'
    }
  ]
}
const expected_response_9 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: '',
      msg: 'parameter must be a numeric value',
      param: 'duration'
    }
  ]
}
const invalidDurationType = 'drozerah'
const expected_response_10 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidDurationType,
      msg: 'parameter must be a numeric value',
      param: 'duration'
    }
  ]
}
const invalidDurationSmall = 0
const expected_response_11 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidDurationSmall,
      msg: 'parameter must be a number between 1 and 1440',
      param: 'duration'
    }
  ]
}
const invalidDurationBig = 1446
const expected_response_12 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidDurationBig,
      msg: 'parameter must be a number between 1 and 1440',
      param: 'duration'
    }
  ]
}
const validDuration = 40
const invalidDateEmpty = ''
const expected_response_13 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidDateEmpty,
      msg: 'invalid parameter date must be ISO 8601 compliant',
      param: 'date'
    }
  ]
}
const invalidDateFormat = '20-01-01'
const expected_response_14 = {
  error: {
    status: '400 BAD REQUEST',
    code: 400
  },
  details: [
    {
      value: invalidDateFormat,
      msg: 'invalid parameter date must be ISO 8601 compliant',
      param: 'date'
    }
  ]
}
const validDateFormat = '2020-01-31'
const dateIso = `${validDateFormat}T00:00:00.000Z`
const expected_response_15 = {
  username: validUserName,
  _id: validUserId,
  description: validDescription,
  duration: 40,
  date: dateIso
}
describe('Test API route /api/exercise/add', () => {
  // Add an exercice to user by id
  it('<no parameters>[userId][description][duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_1 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_1))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId]<no parameters>[description][duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_2 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_2))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<invalid>[userId]<no parameters>[description][duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_3 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: invalidUserId })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_3))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid no matching data>[userId]<no parameters>[description][duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_4 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserIdNotFound })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_4))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId]<invalid empty>[description]<no parameters>[duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_5 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: '' })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_5))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId]<invalid too short>[description]<no parameters>[duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_6 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: 'a' })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_6))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId]<invalid too loog>[description]<no parameters>[duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_7 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: tooLongDescription })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_7))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description]<no parameters>[duration][date] expect Content-Type = JSON | status code = 400 | response = expected_response_8 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_8))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description]<invalid empty>[duration]<no parameters>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_9 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: '' })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_9))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description]<invalid numeric type>[duration]<no parameters>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_10 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: invalidDurationType })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_10))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description]<invalid too small numeric>[duration]<no parameters>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_11 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: invalidDurationSmall })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_11))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description]<invalid too big numeric>[duration]<no parameters>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_12 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: invalidDurationBig })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_12))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description][duration]<invalid empty>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_13 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: validDuration })
      .send({ date: invalidDateEmpty })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_13))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description][duration]<invalid empty>[date] expect Content-Type = JSON | status code = 400 | response = expected_response_14 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: validDuration })
      .send({ date: invalidDateFormat })
      .expect('Content-Type', /json/)
      .expect(400, JSON.stringify(expected_response_14))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
  it('<valid>[userId][description][duration][date] expect Content-Type = JSON | status code = 200 | response = expected_response_15 Object', (done) => {
    request(app)
      .post('/api/exercise/add')
      .send({ userId: validUserId })
      .send({ description: validDescription })
      .send({ duration: validDuration })
      .send({ date: validDateFormat })
      .expect('Content-Type', /json/)
      .expect(200, JSON.stringify(expected_response_15))
      .end((err, res) => {
        if (err) {
          done(err)
        } else {
          done()
        }
      })
  })
})
