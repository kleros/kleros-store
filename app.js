const express = require('express'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    fs = require('fs'),
    colors = require('colors'),
    mongoose = require('mongoose'),
    ipfilter = require('express-ipfilter').IpFilter

const index = require('./routes/index')

// load enviornment variables
require('dotenv').config()

const config = require('./config')

mongoose.Promise = require('bluebird')

mongoose.connect(config.database, { useMongoClient: true })
  .then(() => console.log('Connected to UV database'.green))
  .catch(err => console.error(err))

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Create the server
//app.use(ipfilter(config.ipsAllowed, {mode: 'allow'}))

// create a write stream (in append mode)
const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'})

// log req and res
app.use(morgan('combined', {stream: accessLogStream}))

app.set('secret', config.secret)

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
// FIXME https://stackoverflow.com/questions/15819337/catch-express-bodyparser-error
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// public routes
app.use('/', index)

app.use('/apidoc', express.static('apidoc'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
