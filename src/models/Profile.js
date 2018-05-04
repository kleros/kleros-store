import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String,
    index: true
  },
  authToken: String, // hex of the expiration date of the token
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
    title: String,
    disputeId: Number,
    evidences: [{
      name: String,
      description: String,
      url: String,
      submittedAt: Number
    }]
  }],
  disputes : [{
    disputeId: Number, // joint key
    arbitratorAddress: String, // joint key
    contractAddress: String,
    partyA : String,
    partyB : String,
    appealCreatedAt: [],
    appealRuledAt: [],
    appealDeadlines: [],
    updated_at: {
      type: Date,
      default: Date.now
    },
    appealDraws: [], // juror
    netPNK: Number // juror
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

export default mongoose.model('profiles', ProfileSchema)
