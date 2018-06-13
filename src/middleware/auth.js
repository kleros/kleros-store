import * as authUtils from '../util/auth'
import { getProfileDb } from '../controllers/profile'

const authWriteRequests = async (req, res, next) => {
  // Only use auth if in production
  if (process.env.NODE_ENV === 'production') {
    const address = req.params['address']
    const signedToken = req.headers.authorization
    if (!signedToken) {
      res.status(401).json({ error: 'Missing authorization token.' })
      return
    }

    const userProfile = await getProfileDb(address)
    const savedToken = userProfile.authToken
    if (!savedToken) {
      res.status(401).json({
        error: `No auth token registered for User Profile. Please call /${address}/authToken`
      })
    }

    if (!authUtils.isTokenValid(savedToken)) {
      res.status(401).json(
        {
          error: 'Auth Token has expired. Please request a new token.'
        }
      )
      return
    }

    // pass pre signed message and signature to get signer address
    const validSig = authUtils.isSigValid(signedToken, userProfile.authToken, address)
    if (!validSig) {
      res.status(401).json(
        {
          error: 'Auth Token signature is invalid.'
        }
      )
      return
    }
  }

  next()
}

export default authWriteRequests
