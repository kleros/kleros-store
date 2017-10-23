const express = require('express')
const router = express.Router()
const DocumentHandlers = require('../controllers/DocumentController')

/**
 * @api {get} kleros/:hash Get document by hash
 *
 * @apiGroup Documents
 *
 * @apiParam {String} hash hash unique of the document.
 *
 * @apiSuccess {String} hash Hash of the document
 * @apiSuccess {String} document Content of the document
 * @apiSuccess {Date} created_at Create's date document
 *
 * @apiParam (Login) {String} token Only logged users users can get this.
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "document": "data",
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 * @apiErrorExample {json} List error
 *    HTTP/1.1 500 Internal Server Error
 */
router.get('/:hash', DocumentHandlers.getDocumentByHash)

/**
 * @api {post} kleros Add a document
 *
 * @apiGroup Documents
 *
 * @apiParam {String} document Document
 *
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "document": "data",
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post('/', DocumentHandlers.addDocument)

/**
 * @api {post} kleros Add a fake document
 *
 * @apiGroup Documents
 *
 * @apiSuccessExample {json} Success
 *   HTTP/1.1 200 OK
 *   {
 *     "_id": "59aca9607879b17103bb1b43",
 *     "document": "data",
 *     "__v": 0,
 *     "created_at": "2017-09-04T01:16:16.726Z"
 *   }
 */
router.post('/fake-data', DocumentHandlers.addFakeDocument)

module.exports = router
