const express = require('express')
const router = express.Router()

/* GET whoiam */
router.get('/', (req, res, next) => {
  res.json({
    ipaddress: req.ip || 'undefined',
    language: req.headers['accept-language'] || 'undefined',
    software: req.headers['user-agent'] || 'undefined'
  })
})

module.exports = router
