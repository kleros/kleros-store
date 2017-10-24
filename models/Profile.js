const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String
  },
  contracts : [{
    hash : String,
    contentDocument : String
  }],
  disputes : [{
    hash : String,
    contentDocument : String
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('profiles', ProfileSchema)
