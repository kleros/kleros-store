import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import routes from './routes'
import seed from './seed'

import config from '../config'

mongoose.Promise = require('bluebird')

mongoose.connect(config.database, { useMongoClient: true })
  .then(() => console.log('Connected to UV database'))
  .catch(err => console.error(err))

// Populate DB with sample data
if (config.seedDb) { seed() }

const app = express()
app.disable('x-powered-by')

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev', {
  skip: () => app.get('env') === 'test'
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '../public')))

// Routes
app.use('/', routes)

// set headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  next()
})

// set secret
app.set('secret', config.secret)

// docs
app.use('/apidoc', express.static('apidoc'))

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found')
  err.status = 404
  next(err)
})

// Error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  res
    .status(err.status || 500)
    .render('error', {
      message: err.message
    })
})

module.exports = app
