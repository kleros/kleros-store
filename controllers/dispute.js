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

exports.getDisputeByHash = async (req, res) => {
  const disputeHash = req.params.disputeHash

  const dispute = await getDisputeDb(disputeHash)
  return res.json(dispute)
}

const getDisputeDb = hash => {
  return new Promise((resolve, reject) => {
    Dispute
      .findOne({hash})
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

exports.getDisputeDb = getDisputeDb

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
