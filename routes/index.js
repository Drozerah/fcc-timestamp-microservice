const express = require('express')
const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  // check is user agent is IE 11
  const isIE11 = `${req.useragent.browser}${req.useragent.version}` === 'IE11.0'
  // render view
  res.render('index', {
    isIE11,
    title: 'Timestamp Microservice REST API'
  })
})

module.exports = router
