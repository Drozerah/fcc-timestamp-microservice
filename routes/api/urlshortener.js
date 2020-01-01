/**
* Express
*/
const express = require('express')
const router = express.Router()
/**
* NPM dependencies
*/
const shortid = require('shortid')
/**
* Middlewares modules
*/
const { validateURL, validateHosteName } = require('../../middlewares/urlshortener')

/* GET short url */
// @route           GET /api/shorturl/:short_url_id
// @description     retrieve originale/long url from short_url_id param
// @spec            When I visit the shortened URL, it will redirect me to my original link.
router.get('/:short_url_id?', (req, res) => {
  // check the param
  if (!req.params.short_url_id) {
    // no param wih request must respond with 400 status code
    res.status(400).json({ error: 'bad request' })
  } else {
    // param ok
    // TODO must redirect to original link found in db
    res.json({ short_url_id: req.params.short_url_id }) // !DEV
  }
})

/* POST original url */
// @route           POST api/shorturl/new/
// @description     submit a new originale/long url and return a short url id
// @spec
//      success case: {"original_url":"www.google.com","short_url":1}
//      error case: {"error":"invalid URL"}
router.post('/new',
  validateURL, // * Middleware
  validateHosteName, // * Middleware
  (req, res) => {
    // console.log(`REQUEST: '${req.body.original_url}'`) // !DEV original url
    let shortUrl
    if (process.env.NODE_ENV === 'test') {
      shortUrl = 'hjklfj8i' // ! TEST
    } else {
      shortUrl = shortid.generate() // ! PROD
    }
    // create response
    const newShortUrl = {
      original_url: req.body.original_url,
      short_url: shortUrl // generated short_url ID
    }
    // send response
    res.json(newShortUrl)
    // TODO insert new short url to db if original url do not already exists
  }
)
module.exports = router
