const express = require('express')
const router = express.Router()

/* GET whoiam */
router.get('/', (req, res, next) => {
  // remove prefix from ip
  let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
  ip = ip.replace('::ffff:', '')
  res.json({
    ipaddress: ip || 'undefined',
    language: req.headers['accept-language'] || 'undefined',
    software: req.headers['user-agent'] || 'undefined'
  })
})

module.exports = router
