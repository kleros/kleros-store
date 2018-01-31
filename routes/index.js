const express = require('express')
const router = express.Router()
const ProfileHandlers = require('../controllers/profile')
const DisputeHandlers = require('../controllers/dispute')
const ArbitratorsHandlers = require('../controllers/arbitrators')

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
 * @apiSuccess {Array} contracts Contract user
 * @apiSuccess {Array} disputes Dispute user
 * @apiSuccess {Date} created_at Create's date document
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
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get(
  '/:address',
  ProfileHandlers.getProfileByAddress
)

/**
 * @api {post} :address Add/Update a profile
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address',
  ProfileHandlers.updateProfile
)

/**
 * @api {post} :address/notifications Add a new notification to profile
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  "/:address/notifications",
  ProfileHandlers.addNotification
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
 * @api {post} arbitrators/:arbitratorAddress/disputes/:disputeId Add/Update a dispute
 *
 * @apiGroup Dispute
 *
 * @apiParam {String} unique hash of the dispute
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
  '/arbitrators/:arbitratorAddress/disputes/:disputeId',
  DisputeHandlers.updateDisputeProfile
)

/**
 * @api {get} arbitrators/:arbitratorAddress/disputes/:disputeId fetch dispute by arbitrator address and disputeId
 *
 * @apiGroup Profile
 *
 * @apiParam {String} unique hash of the dispute
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
router.get(
  '/arbitrators/:arbitratorAddress/disputes/:disputeId',
  DisputeHandlers.getDispute
)

/**
 * @api {post} arbitrators/:arbitratorAddress Add/Update a arbitrator
 *
 * @apiGroup Arbitrator
 *
 * @apiParam {String} address of arbitrator
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "address": '0x133b5b851cc62de33a02c928f6ac112cd42d1d83',
 *     "lastBlock": 5235,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/arbitrators/:arbitratorAddress',
  ArbitratorsHandlers.updateArbitrator
)

/**
 * @api {get} arbitrators/:arbitratorAddress fetch arbitrator with last block data
 *
 * @apiGroup Arbitrator
 *
 * @apiParam {String} address of arbitrator contract
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "address": '0x133b5b851cc62de33a02c928f6ac112cd42d1d83',
 *     "lastBlock": 5235,
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.get(
  '/arbitrators/:arbitratorAddress',
  ArbitratorsHandlers.getArbitrator
)

module.exports = router
