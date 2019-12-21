const express = require('express')
const router = express.Router()

/* GET timestamp. */
router.get('/', (req, res, next) => {
  res.json({ result: 'timestamp' })
})

module.exports = router
