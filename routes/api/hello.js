const express = require('express')
const router = express.Router()

/* GET hello message. */
router.get('/', (req, res, next) => {
  res.json({ message: 'hello' })
})

module.exports = router
