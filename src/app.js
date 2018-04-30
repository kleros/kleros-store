import express from 'express'
import path from 'path'
import favicon from 'serve-favicon'
import logger from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import fs from 'fs'
import colors from 'colors'
import mongoose from 'mongoose'
import { ipfilter } from 'express-ipfilter'

import seed from './seed'
import authMiddleware from './middleware/auth'
import config from '../config'
import routes from './routes'

// load enviornment variables
require('dotenv').config()

// Populate DB with sample data
if (config.seedDb) { seed() }

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

app.use(authMiddleware)
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
app.use('/', routes)

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
