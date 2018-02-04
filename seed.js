const seeder = require('mongoose-seed')
const config = require('./config')
const getFakeData = require('./controllers/fake-data')

const data = [
  {
    model: 'profiles',
    documents: getFakeData('profile1')
  }
]

function seed() {
  seeder.connect(config.database, { useMongoClient: true }, async () => {
    seeder.loadModels([
      'models/Profile.js'
    ])

    await seeder.clearModels(['profiles'], (err) => {
      if (err) { console.error(err) }
    })

    await seeder.populateModels(data, (err) => {
      if (err) { console.error(err) }
    });
  })
}

module.exports = seed
