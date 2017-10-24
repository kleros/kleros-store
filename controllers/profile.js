const _ = require('lodash')
const Profile = require('../models/Profile'),
      constants = require('../constants')

exports.updateProfile = async (req, res) => {
  const address = req.params.address

  const ProfileInstance = new Profile(req.body)

  ProfileInstance.save((err, Profile) => {
    if (err) {
      return res.status(400).send({
        message: err,
      })
    } else {
      return res.json(Profile)
    }
  })
}

exports.getProfileByAddress = async (req, res) => {
  try {
    let ProfileInstance = await getProfileDb(req.params.address)
    res.json(ProfileInstance)
  } catch (e) {
    res.send(e)
  }
}

exports.addFakeProfile = (req, res) => {
  const ProfileInstance = new Profile({
    address: '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
    contracts: [
      {
        hash : 'f88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
        contentDocument : 'kleros'
      },
      {
        hash : 'af2caa1c2ca1d027f1ac823b529d0a67cd144264b2789fa2ea4d63a67c7103cc',
        contentDocument : 'vitalik'
      },
    ],
    disputes: [
      {
        hash : 'f88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
        contentDocument : 'kleros'
      },
      {
        hash : '541111248b45b7a8dc3f5579f630e74cb01456ea6ac067d3f4d793245a255155',
        contentDocument : 'ethereum'
      },
    ]
  })

  ProfileInstance.save((err, Profile) => {
    if (err) {
      return res.status(400).send({
        message: err,
      })
    } else {
      return res.json(Profile)
    }
  })
}

const getProfileDb = address => {
  return new Promise((resolve, reject) => {
    Profile
      .findOne({address})
      .sort('-created_at')
      .exec(
        (err, Profile) => {
          if (err)
            reject(err)
          resolve(Profile)
        }
      )
  })
}
