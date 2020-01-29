const createError = require('http-errors')
const express = require('express')
const connectDB = require('./config/db')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const sassMiddleware = require('node-sass-middleware')
const useragent = require('express-useragent')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const helloRouter = require('./routes/api/hello')
const timestampRouter = require('./routes/api/timestamp')
const whoiamRouter = require('./routes/api/whoami')
const shortUrlRouter = require('./routes/api/urlshortener')
const exerciceTrackerRouter = require('./routes/api/exercicetracker')

const app = express()
// Connect to db
connectDB()
var cors = require('cors')
app.use(cors({ optionSuccessStatus: 200 })) // some legacy browsers choke on 204
// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true
}))
app.use(useragent.express())
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/api/hello', helloRouter)
app.use('/api/timestamp', timestampRouter)
// remove favicon
app.use(function (req, res, next) {
  if (req.originalUrl && req.originalUrl.split('/').pop() === 'favicon.ico') {
    return res.sendStatus(204)
  }
  return next()
})
app.use('/api/whoami', whoiamRouter)
app.use('/api/shorturl/', shortUrlRouter)
app.use('/api/exercise/', exerciceTrackerRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
  res.redirect('/')
})

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
