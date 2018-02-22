const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DisputesSchema = new Schema({
  hash: String,
  id: String,
  disputeId: Number,
  arbitratorAddress: String,
  contractAddress: String,
  partyA : String,
  partyB : String,
  title : String,
  deadline : String,
  status : String,
  fee: Number,
  information : String,
  justification : String,
  subscribers: [], // jurors can subscribe to notifications for a dispute
  ruling: Number, // 0 means no decision
  session: Number, // session that dispute was active
  resolutionOptions: [{
    name: String,
    description: String,
    value: Number
  }],
  createdAt: Number,
  ruledAt: Number
},
{
  versionKey: false,
  usePushEach: true
})

// index disputes by aribtrator address and then disputeId
DisputesSchema.index({arbitratorAddress: 1, disputeId: -1})

module.exports = mongoose.model('disputes', DisputesSchema)
