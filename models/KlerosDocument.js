const mongoose = require('mongoose')
const Schema = mongoose.Schema

const KlerosDocumentSchema = new Schema({
  hash: {
    type: String
  },
  kleros_document: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})

module.exports = mongoose.model('documents', KlerosDocumentSchema)
