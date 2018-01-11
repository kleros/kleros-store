const _ = require('lodash')
const Dispute = require('../models/Disputes'),
      constants = require('../constants')

exports.updateDisputeProfile = async (req, res) => {
  const disputeId = req.params.disputeId
  const arbitratorAddress = req.params.arbitratorAddress
  const bodyContract = req.body

  // update db with body
  const newDispute = await updateDisputeDb(new Dispute(bodyContract))
  return res.json(newDispute)
}

exports.getDispute = async (req, res) => {
  const disputeId = req.params.disputeId
  const arbitratorAddress = req.params.arbitratorAddress

  const dispute = await getDisputeDb(arbitratorAddress, disputeId)
  return res.json(dispute)
}

const getDisputeDb = (arbitratorAddress, disputeId) => {
  return new Promise((resolve, reject) => {
    Dispute
      .findOne({arbitratorAddress, disputeId})
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
