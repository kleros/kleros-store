const sigUtil = require('eth-sig-util')

const authUtils = require('../util/auth')
const getProfileDb = require('../controllers/profile').getProfileDb

const authWriteRequests = async (req, res, next) => {
  // Only have to auth requests that modify data (POST and PUT)
  if (req.method == 'POST' || req.method == 'PUT') {
    const address = req.params['address']
    const signedToken = req.headers.authorization
    if (!signedToken) {
      res.status(401).send({ error: 'Missing authorization token.' })
      return
    }

    const userProfile = await getProfileDb(address)
    if (!authUtils.isTokenValid(userProfile.authToken)) {
      res.status(401).send(
        {
          error: 'Auth Token has expired. Please request a new token.'
        }
      )
      return
    }

    // pass pre signed message and signature to get signer address
    msgParams = {
      'data': userProfile.authToken,
      'sig': signedToken
    }
    const authorizedUser = sigUtil.recoverPersonalSignature(msgParams)

    if (!address === authorizedUser) {
      res.status(401).send({ error: 'Not authorized to write to resource.' })
      return
    }
  }

  next()
}

exports.default = authWriteRequests