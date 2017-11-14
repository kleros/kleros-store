const express = require('express')
const router = express.Router()
const ProfileHandlers = require('../controllers/profile')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Kleros store (API)' })
})

/**
 * @api {post} kleros Add a fake profile
 *
 * @apiGroup Profile
 *
 * @apiParam {String} address Ethereum of the juror
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
router.post('/fake-data/:address', ProfileHandlers.addFakeProfiles)

/**
 * @api {get} kleros/:address Get profile by address
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:address', ProfileHandlers.getProfileByAddress)

/**
 * @api {post} kleros Add/Update a profile
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post('/:address', ProfileHandlers.updateProfile)

/**
 * @api {post} kleros Add an evidence in the contract
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/contracts/:contractAddress/evidence',
  ProfileHandlers.addEvidenceContractProfile
)

/**
 * @api {post} kleros Add/Update a contract
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
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post(
  '/:address/contracts/:contractAddress',
  ProfileHandlers.updateContractProfile
)

module.exports = router
