const _ = require('lodash')
const Web3 = require('web3')
const sha3 = new Web3().sha3
const KlerosDocument = require('../models/KlerosDocument'),
      constants = require('../constants')

exports.addDocument = (req, res) => {
  let newKlerosDocument = new KlerosDocument()

  newKlerosDocument.hash = sha3(req.body.document)
  newKlerosDocument.kleros_document = req.body.document

  newKlerosDocument.save((err, klerosDocument) => {
    if (err)
      res.send(err)
    if (!err)
      res.json(klerosDocument)
  })
}

exports.getDocumentByHash = async (req, res) => {
  try {
    let klerosDocument = await getKlerosDocumentDb(req.params.hash)
    res.json(klerosDocument)
  } catch (e) {
    res.send(e)
  }
}

exports.addFakeDocument = (req, res) => {
  const klerosDocument = new KlerosDocument({
    hash: '123',
    kleros_document: '123',
  })

  klerosDocument.save((err, klerosDocument) => {
    if (err) {
      return res.status(400).send({
        message: err,
      })
    } else {
      return res.json(klerosDocument)
    }
  })
}

getKlerosDocumentDb = hash => {
  return new Promise((resolve, reject) => {
    KlerosDocument.findOne({hash}, (err, klerosDocument) => {
      if (err)
        reject(err)
      resolve(klerosDocument)
    })
  })
}
