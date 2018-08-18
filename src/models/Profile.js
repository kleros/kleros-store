import mongoose from 'mongoose'
const Schema = mongoose.Schema

const ProfileSchema = new Schema({
  address: {
    type: String,
    index: true
  },
  lastBlock: Number,
  session: Number,
  contracts : [{
    address: String,
    transactionId: Number,
    email: String,
    evidence: [{
      name: String,
      description: String,
      URI: String,
      fileHash: String
    }],
    metaEvidence: {
      fileURI: String,
      fileHash: String,
    	category: String,
      title: String,
      description: String,
      aliases: {},
      question: String,
    	rulingOptions: {
    		titles: [],
    		descriptions: []
    	},
    	evidenceDisplayInterfaceURI: String
    }
  }],
  disputes : [{
    disputeId: Number, // joint key
    arbitratorAddress: String, // joint key
    updated_at: {
      type: Date,
      default: Date.now
    },
    appealDraws: [], // juror
    blockNumber: Number
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
