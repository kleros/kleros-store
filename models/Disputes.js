const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DisputesSchema = new Schema({
  id: String,
  disputeId: Number,
  arbitratorAddress: String,
  contractAddress: String,
  partyA : String,
  partyB : String,
  title : String,
  deadline : Number,
  status : String,
  fee: Number,
  information : String,
  justification : String,
  resolutionOptions: [{
    name: String,
    description: String,
    value: Number
  }],
  appealCreatedAt: [],
  appealRuledAt: [],
  updated_at: {
    type: Date,
    default: Date.now
  }
},
{
  versionKey: false,
  usePushEach: true
})

// index disputes by aribtrator address and then disputeId
DisputesSchema.index({arbitratorAddress: 1, disputeId: -1})

module.exports = mongoose.model('disputes', DisputesSchema)
