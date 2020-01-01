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
/**
* Debug
*/
console.log(`[APP-MODE] ${app.get('env')}`)
/**
* Settings
*/
const shortUrlId = 'hjklfj8i' // hardcoded ID for tests
const notFoundshortUrlId = '--------'
const originalUrl = 'https://www.google.com'
/**
* Specifications
*/
// // FCC tests
// // [x] When I visit that shortened URL, it will redirect me to my original link.
// // Custom tests
// // [x] It should return a 400 status code and json {"400": "bad request"}
// eslint-disable-next-line no-undef
describe('Test API route /api/shorturl/:param?', () => {
  // eslint-disable-next-line no-undef
  it('No ID parameter should return a 400 status code and JSON {"error": "bad request"}', (done) => {
    request(app)
      .get('/api/shorturl')
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.error === 'bad request') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  // eslint-disable-next-line no-undef
  it('No ID found should return a 400 status code and JSON {"error": "bad request"}', (done) => {
    request(app)
      .get(`/api/shorturl/${notFoundshortUrlId}`)
      .expect('Content-Type', /json/)
      .expect(400)
      .then(response => {
        if (response.body.error === 'bad request') {
          done()
        } else {
          const e = 'error'
          done(e)
        }
      })
  })
  // eslint-disable-next-line no-undef
  it('Valid parameter should return a 302 status code for redirection and Content-type \'text/plain; charset=utf-8\'', (done) => {
    request(app)
      .get(`/api/shorturl/${shortUrlId}`)
      .expect('Content-Type', 'text/plain; charset=utf-8')
      .expect(302)
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})

/**
* Specifications
*/
// // FCC tests
// // [x] If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
// // [x] I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.
// eslint-disable-next-line no-undef
describe('Test API route /api/shorturl/new', () => {
  // eslint-disable-next-line no-undef
  it('Invalid URL should return a 401 status code with a JSON {"error": "invalid URL"}', (done) => {
    request(app)
      .post('/api/shorturl/new')
      .send({ original_url: 'htps://www.google.com' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(401, {
        error: 'invalid URL'
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
  // eslint-disable-next-line no-undef
  it(`Valid URL should return a 200 status code with a JSON {"original_url": "${originalUrl}","short_url": "${shortUrlId}"}`, (done) => {
    request(app)
      .post('/api/shorturl/new')
      .send({ original_url: originalUrl })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        original_url: originalUrl,
        short_url: shortUrlId // ID of test
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
