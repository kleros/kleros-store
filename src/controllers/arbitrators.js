const Arbitrator = require('../models/Arbitrators')

exports.updateArbitrator = async (req, res) => {
  const arbitratorAddress = req.params.arbitratorAddress
  const body = req.body

  const newArbitratorInstance = new Arbitrator(
    {
      address: arbitratorAddress,
      lastBlock: body.lastBlock
    }
  )

  newArbitratorInstance.save((err, Arbitrator) => {
    if (err) {
      return res.status(400).send({
        message: err,
      })
    } else {
      return res.json(Arbitrator)
    }
  })
}

exports.getArbitrator = async (req, res) => {
  const arbitratorAddress = req.params.arbitratorAddress

  const arbitrator = await getArbitratorDb(arbitratorAddress)
  return res.json(arbitrator)
}

const getArbitratorDb = (address) => {
  return new Promise((resolve, reject) => {
    Arbitrator
      .findOne({address})
      .sort('-created_at')
      .exec(
        (err, Arbitrator) => {
          if (err)
            reject(err)
          resolve(Arbitrator)
        }
      )
  })
}
