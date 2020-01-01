/**
* NPM modules
*/
const isUrl = require('is-valid-http-url')
/**
* Modules
*/
const dnsLookup = require('../controllers/dnsLookup')
/**
* Check if a given url is valid
*/
const validateURL = (req, res, next) => {
  // console.log('validateURL middleware') // !DEV
  // check if req.body.original_url is a valid url
  const originalUrl = req.body.original_url
  if (!isUrl(originalUrl)) {
    // invalid url
    // console.log('REQUEST: is invalid URL') // !DEV
    // response
    res.status(401).json({ error: 'invalid URL' })
  } else {
    // valid url
    next()
  }
}
/**
* Check if a given url as a valid hostname
*/
const validateHosteName = (req, res, next) => {
  // console.log('validateHosteName middleware') // !DEV
  const originalUrl = req.body.original_url
  dnsLookup(originalUrl)
    .catch(error => {
      // promise rejected
      console.error(error) // !DEV
      // invalid url
      // console.log(`REQUEST: is valid URL ? ${error}`) // !DEV
      // response
      res.status(401).json({ error: 'invalid URL' })
    })
    .then(value => {
      // promise resolved
      // console.log(`REQUEST: is valid URL ? ${value}`) // !DEV
      next()
    })
}

module.exports = { validateURL, validateHosteName }
