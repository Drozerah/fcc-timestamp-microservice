const express = require('express')
const router = express.Router()

/* GET short url */
// @route           GET /api/shorturl/:short_url_id
// @description     Create short URL from long url
// @spec            When I visit the shortened URL, it will redirect me to my original link.
router.get('/:short_url_id?', (req, res, next) => {
  // check the param
  if (!req.params.short_url_id) {
    // no param wih request must response with 400 status code
    res.status(400).json({ error: 'bad request' })
  } else {
    // param ok
    // TODO must redirect to original link found in db
    res.json({ short_url_id: req.params.short_url_id }) // !DEV
  }
})

module.exports = router
