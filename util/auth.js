const ethUtil = require('ethjs-util')

const config = require('../config')

/**
 * Get a new timestamped auth token for a user to sign. Token includes the version and the expiration date.
 * @returns {string} Hex string of the token object
 */
exports.getTimestampedToken = () => {
  // expiration date is stored as epoch timestamp in milliseconds
  const expiration = new Date().valueOf() + (1000 * config.authTokenLengthSeconds)

  return ethUtil.fromAscii(JSON.stringify({
    version: config.authTokenVersion,
    expiration
  }))
}

/**
 * Checks that a user's token is valid.
 * @param {string} unsignedToken - The unsigned user token stored in the db.
 * @returns {bool} True if the token is valid.
 */
exports.isTokenValid = (unsignedToken) => {
  const unsignedTokenData = JSON.parse(ethUtil.toAscii(unsignedToken))

  // token is valid if we are using the same version of token and the expiration date is in the future
  return (
    tokenData.version === config.authTokenVersion &&
    tokenData.expiration > new Date().valueOf()
  )
}