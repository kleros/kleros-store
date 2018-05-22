import mongoose from 'mongoose'

import app from './app'
import seed from './seed'

import config from '../config'

const { PORT = 3000 } = process.env
app.listen(PORT, () => console.log(`Listening on port ${PORT}`)) // eslint-disable-line no-console

// Populate DB with sample data
if (config.seedDb) { seed() }

mongoose.Promise = require('bluebird')

mongoose.connect(config.database, { useMongoClient: true })
  .then(() => console.log('Connected to UV database'.green))
  .catch(err => console.error(err))
