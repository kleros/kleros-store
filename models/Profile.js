const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String,
    index: true
  },
  session: Number,
  lastBlock: Number,
  contracts : [{
    address: String,
    hash : String,
    partyA : String,
    partyB : String,
    arbitrator: String,
    timeout: Number,
    email: String,
    description: String,
    name: String,
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
    votes: [Number],
    netPNK: Number
  }],
  notifications: [{
    txHash: {
      type: String,
    }, // uuid for notification
    logIndex: Number, // isn't enough just to have txHash
    notificationType: Number, // cooresponds to types enum
    read: {
      type: Boolean,
      default: false
    },
    message: String,
    data: {}, // extra field for json string of arbitrary data
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  created_at: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false,
  usePushEach: true
})

module.exports = mongoose.model('profiles', ProfileSchema)
