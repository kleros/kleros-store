const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String
  },
  contracts : [{
    hash : String,
    partyA : String,
    partyB : String,
    email: String,
    description: String,
    evidencePartyA: [{
      hash: String,
      documentContent: String
    }],
    evidencePartyB: [{
      hash: String,
      documentContent: String
    }],
  }],
  disputes : [{
    hash : String,
    contractAddress: String,
    partyA : String,
    partyB : String,
    information : String,
    jsutification : String
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false
})

module.exports = mongoose.model('profiles', ProfileSchema)
