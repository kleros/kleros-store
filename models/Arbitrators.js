const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ArbitratorsSchema = new Schema({
  address: {
    type: String,
    index: true
  },
  lastBlock: Number,
  created_at: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false,
  usePushEach: true
})

module.exports = mongoose.model('arbitrators', ArbitratorsSchema)
