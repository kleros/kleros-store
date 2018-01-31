const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String,
    index: true
  },
  session: Number,
  contracts : [{
    address: String,
    hash : String,
    partyA : String,
    partyB : String,
    arbitrator: String,
    timeout: Number,
    email: String,
    description: String,
    disputeId: Number,
    evidences: [{
      name: String,
      description: String,
      url: String
    }]
  }],
  disputes : [{
    disputeId: Number, // joint key
    arbitratorAddress: String, // joint key
    isJuror: Boolean,
    hasRuled: Boolean,
    votes: [Number]
  }],
  notifications: [{
    type: String,
    message: String,
    data: String, // extra field for json string of arbitrary data
    date: Date.now
  }]
  created_at: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false
})

module.exports = mongoose.model('profiles', ProfileSchema)
