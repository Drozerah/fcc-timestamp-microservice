const app = require('../app')
const request = require('supertest')
console.log(`[APP-MODE] ${app.get('env')}`)
/**
* Specifications
*/
// FCC tests
// TODO [ ] When I visit that shortened URL, it will redirect me to my original link.

// // Custom tests
// // [x] It should return a 400 status code and json {"400": "bad request"}
// // [x] It should return a 200 status code and json {"short_url_id": "the given id"}

// eslint-disable-next-line no-undef
describe('Test API route /api/shorturl', () => {
  // eslint-disable-next-line no-undef
  it('It should return a 400 status code and JSON {"error": "bad request"}', (done) => {
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
  const param = 'id'
  const getUrl = `/api/shorturl/${param}`
  // eslint-disable-next-line no-undef
  it(`It should return a 200 status code and JSON {"short_url_id": "${param}"}`, (done) => {
    request(app)
      .get(getUrl)
      .expect('Content-Type', /json/)
      .expect(200)
      .then(response => {
        if (response.body.short_url_id === param) {
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
// // FCC tests
// // [x] If I pass an invalid URL that doesn't follow the valid http://www.example.com format, the JSON response will contain an error instead.
// // [x] I can pass a URL as a parameter and I will receive a shortened URL in the JSON response.

// Custom tests
// ? none
const originalUrl = 'https://www.google.com'
const shortUrl = 'hjklfj8i'
// eslint-disable-next-line no-undef
describe('Test API route /api/shorturl/new', () => {
  // eslint-disable-next-line no-undef
  it('It should return a 401 status code with a JSON {"error": "invalid URL"}', (done) => {
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
  it(`It should return a 200 code status with a JSON {"original_url": "${originalUrl}","short_url": "${shortUrl}"}`, (done) => {
    request(app)
      .post('/api/shorturl/new')
      .send({ original_url: originalUrl })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {
        original_url: originalUrl,
        short_url: shortUrl // ID of test
      })
      .end((err) => {
        if (err) return done(err)
        done()
      })
  })
})
