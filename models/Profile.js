const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String
  },
  contracts : [{
    address: String,
    hash : String,
    partyA : String,
    partyB : String,
    arbitrator: String,
    timeout: Number,
    email: String,
    description: String,
    evidencePartyA: [{
      hash: String,
      title: String,
      description: String,
      documentContent: String
    }],
    evidencePartyB: [{
      hash: String,
      title: String,
      description: String,
      documentContent: String
    }],
  }],
  disputes : [{
    id: String,
    disputeId: Number,
    hash : String,
    contractAddress: String,
    partyA : String,
    partyB : String,
    title : String,
    deadline : String,
    status : String,
    fee: Number,
    information : String,
    justification : String,
    resolutionOptions: [{
      name: String,
      description: String,
      value: Number
    }]
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
