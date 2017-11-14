const _ = require('lodash')
const Dispute = require('../models/Disputes'),
      constants = require('../constants')

exports.updateDisputeProfile = async (req, res) => {
  const disputeHash = req.params.disputeHash
  const bodyContract = req.body

  // update db with body
  const newDispute = await updateDisputeDb(new Dispute(bodyContract))
  return res.json(newDispute)
}

const getDisputeDb = address => {
  return new Promise((resolve, reject) => {
    Dispute
      .findOne({address})
      .sort('-created_at')
      .exec(
        (err, Dispute) => {
          if (err)
            reject(err)
          resolve(Dispute)
        }
      )
  })
}

const updateDisputeDb = Dispute => {
  return new Promise((resolve, reject) => {
    Dispute.save((err, newDispute) => {
      if (err)
        reject({
          message: err,
        })
      resolve(newDispute)
    })
  })
}
