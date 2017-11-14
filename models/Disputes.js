const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DisputesSchema = new Schema({
  hash: String,
  id: String,
  disputeId: Number,
  votes: [Number],
  contractAddress: String,
  partyA : String,
  partyB : String,
  title : String,
  deadline : String,
  status : String,
  fee: Number,
  information : String,
  justification : String,
  ruling: Number, // 0 means no decision
  resolutionOptions: [{
    name: String,
    description: String,
    value: Number
  }]
})

module.exports = mongoose.model('disputes', DisputesSchema)
