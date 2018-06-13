const seeder = require('mongoose-seed')
const config = require('../config')
const getFakeData = require('./controllers/fake-data')

const data = [
  {
    model: 'profiles',
    documents: getFakeData('profile1')
  }
]

const seed = () =>
  new Promise((resolve, reject) =>
    seeder.connect(config.database, { useMongoClient: true }, async () => {
      seeder.loadModels([
        'src/models/Profile.js'
      ])

      await seeder.clearModels(['profiles'], (err) => {
        if (err) { console.error(err) }
        reject(err)
      })

      await seeder.populateModels(data, (err) => {
        if (err) { console.error(err) }
        reject(err)
      })

      resolve()
    })
  )

module.exports = seed
