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
* Mongoose Model
*/
const ShortUrl = require('../../models/urlshortener') // url db model
/**
* Middlewares modules
*/
const { validateURL, validateHosteName } = require('../../middlewares/urlshortener')

/* POST original url */
// @route           POST api/shorturl/new/
// @description     submit a new originale/long url and return a short url id
// @spec
//      success case: {"original_url":"www.google.com","short_url":1}
//      error case: {"error":"invalid URL"}
router.post('/new',
  validateURL, // * Middleware
  validateHosteName, // * Middleware
  async (req, res) => {
    // console.log(`REQUEST: '${req.body.original_url}'`) // !DEV original url
    // * settings
    const originalUrl = req.body.original_url
    let shortUrlId
    if (process.env.NODE_ENV === 'test') {
      shortUrlId = 'hjklfj8i' // ! TEST
    } else {
      shortUrlId = shortid.generate() // * PROD
    }
    const baseUrl = req.baseUrl // ex /api/shorturl
    const appUrl = `${req.protocol + '://' + req.get('host')}` // ex http://localhost:3000
    const shortUrl = `${req.protocol + '://' + req.get('host') + req.baseUrl + '/' + shortUrlId}` // ex http://localhost:3000/api/shorturl/lkjdfdlk
    // * create response Object
    const resShortUrl = {
      original_url: originalUrl,
      short_url: shortUrlId // generated short_url ID
    }
    /**
    * * Working with db
    */
    try {
      // check if the shorten url already exists in db
      // findOne
      let url = await ShortUrl.findOne({ originalUrl })
      // * shortened url already in db
      if (url) {
        // return existing url
        // update response Object short url ID from existing db Object
        // eslint-disable-next-line dot-notation
        resShortUrl['short_url'] = url.shortUrlId
        // send response to client
        res.json(resShortUrl)
      } else {
        // * shortened is not already in db
        // create a new shortUrl Object
        url = new ShortUrl({
          originalUrl,
          shortUrlId,
          baseUrl,
          appUrl,
          shortUrl,
          date: new Date()
        })
        // * save new ShortUrl object in db
        await url.save()
        // send response to client
        res.json(resShortUrl)
      }
    } catch (error) {
      // ! db failure case
      console.error(error)
      // send error message to client
      res.status(500).json('Server error')
    }
  }
)

/* GET short url */
// @route           GET /api/shorturl/:short_url_id
// @description     retrieve originale/long url from short_url_id param
// @spec            When I visit the shortened URL, it will redirect me to my original link.
router.get(
  '/:short_url_id?',
  async (req, res) => {
    // settings
    const shortUrlId = req.params.short_url_id
    // * request param test
    if (!shortUrlId) {
      // no param wih request must respond with 400 status code
      res.status(400).json({ error: 'bad request' })
    } else {
    // param is ok
    /**
     * * Working with db
     */
      try {
        // * check if the shorten url already exists in db
        // findOne
        const data = await ShortUrl.findOne({ shortUrlId })
        if (data) {
          // * shortened url already in db
          // * update data Object increment views
          await data.updateOne({ $inc: { views: 1 } })
          // * make redirection
          res.redirect(data.originalUrl)
        } else {
          // * shortened url is not found in db
          // * clien response
          res.status(400).json({ error: 'bad request' })
        }
      } catch (error) {
        // ! db failure case
        console.error(error)
        // send error message to client
        res.status(500).json('Server error')
      }
    }
  })
module.exports = router
