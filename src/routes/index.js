import express from 'express'

import * as ProfileHandlers from '../controllers/profile'

const router = express.Router()

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kleros store (API)' })
})

/**
 * @api {get} :address Get profile by address
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the user
 *
 * @apiSuccess {Object[]} contracts Contract user
 * @apiSuccess {Object[]} disputes Dispute user
 * @apiSuccess {Date} created_at Create's date document
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "lastBlock": 0,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get(
  '/:address',
  ProfileHandlers.getProfileByAddress
)

/**
 * @api {post} :address Add a new profile. Cannot overwrite existing user profiles.
 * Use other update methods to add new data to profile.
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the user
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "lastBlock": 0,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address',
  ProfileHandlers.newUserProfile
)

/**
 * @api {post} :address/lastBlock Update last block checked by user profile. lastBlock
 * is used as an untrusted start point for fetching contract logs.
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the user.
 * @apiParam (body) {Number} lastBlock last block number we have seen.
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "lastBlock": 0,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/lastBlock',
  ProfileHandlers.updateLastBlock
)

/**
 * @api {post} :address/lastBlock Update the session. This is used as a performance
 * helper for kleros-api so that a user that has already looked up their disputes
 * for a session won't have to do it again.
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the user.
 * @apiParam (body) {Number} session The current session for which we have looked up disputes.
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "lastBlock": 0,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/session',
  ProfileHandlers.updateSession
)

/**
 * @api {post} :address/notifications Add a new notification to profile
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the user.
 * @apiParam {String} txHash Transaction hash of tx that produced event.
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  "/:address/notifications/:txHash",
  ProfileHandlers.addNotification
)

/**
 * @api {post} :address/contracts/:contractAddress Add/Update a contract
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum address of the user
 * @apiParam {String} address Ethereum address of the contract
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/contracts/:contractAddress',
  ProfileHandlers.updateContractProfile
)

/**
 * @api {post} :address/contracts/:contractAddress/evidence Add an evidence in the contract
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum address of the user
 * @apiParam {String} address Ethereum address of the contract
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "notifications": [],
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/contracts/:contractAddress/evidence',
  ProfileHandlers.addEvidenceContractProfile
)

/**
 * @api {post} :address/arbitrator/:arbitratorAddress/disputes/:disputeId Add/Update a dispute
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum address of the user
 * @apiParam {String} address Ethereum address of the dispute
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/arbitrators/:arbitratorAddress/disputes/:disputeId',
  ProfileHandlers.updateDisputesProfile
)

/**
 * @api {post} :address/arbitrators/:arbitratorAddress/disputes/:disputeId/draws Add draws to dispute profile
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum address of the user
 * @apiParam {String} arbitratorAddress Ethereum address of the aribtrator
 * @apiParam {String} disputeId Index of the dispute
 * @apiParam (body) {Number[]} draws Array of draw numbers
 * @apiParam (body) {Number} appeal The number of the appeal. First session disputes (no appeal) is 0.
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "contracts": [],
 *     "disputes": [],
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/arbitrators/:arbitratorAddress/disputes/:disputeId/draws',
  ProfileHandlers.addNewDrawsDisputeProfile
)

export default router
