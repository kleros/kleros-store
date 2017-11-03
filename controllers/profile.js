const _ = require('lodash')
const Profile = require('../models/Profile'),
      constants = require('../constants'),
      getFakeData = require('./fake-data')


exports.updateProfile = async (req, res) => {
  const address = req.params.address

  const newProfileInstance = new Profile(
    {
      address: address,
      ...req.body
    }
  )

  newProfileInstance.save((err, Profile) => {
    if (err) {
      return res.status(400).send({
        message: err,
      })
    } else {
      return res.json(Profile)
    }
  })
}

exports.updateContractProfile = async (req, res) => {
  const address = req.params.address
  const contractAddress = req.params.contractAddress
  const bodyContract = req.body

  // force the correct address
  bodyContract.address = req.params.contractAddress

  let ProfileInstance = await getProfileDb(address)

  // if not exists, we create this new user
  if (_.isNull(ProfileInstance)) {
    ProfileInstance = new Profile(
      {
        address: address
      }
    )
  }

  // remove the older contract
  // FIXME keep partyA and partyB contents
  let contracts = ProfileInstance.contracts.filter(contract => {
      return contract.address !== contractAddress
  })

  // add the new contract
  contracts.push(bodyContract)

  // update the contract in the profile (x-www-form-urlencoded)
  ProfileInstance.contracts = contracts

  const secondAddress = (bodyContract.partyA === address)
    ? bodyContract.partyB
    : bodyContract.partyA

  let SecondProfileInstance = await getProfileDb(secondAddress)

  // if the second profile not exists still, we create it
  if (_.isNull(SecondProfileInstance)) {
    SecondProfileInstance = new Profile(
      {
        address: secondAddress
      }
    )
  }

  SecondProfileInstance.contracts = contracts

  const [NewProfile, NewSecondProfile] = await Promise.all([
    updateProfileDb(ProfileInstance),
    updateProfileDb(SecondProfileInstance),
  ])

  return res.json([
    NewProfile,
    NewSecondProfile
  ])
}

exports.updateDisputesProfile = async (req, res) => {
  const address = req.params.address

  const profileInstance = await getProfileDb(address)

  const newProfileInstance = new Profile(Object.assign({}, {address: address}, req.body))

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
    const ProfileInstance = await getProfileDb(req.params.address)
    res.json(ProfileInstance)
  } catch (e) {
    res.send(e)
  }
}

exports.addFakeProfiles = async (req, res) => {
  const profileInstances = [],
        profilePromises = []

  // create user profiles for two parties in disputes and a user profile for :account as a juror
  profiles = getFakeData(req.params.address)

  for (let i=0; i<profiles.length; i++) {
    profilePromises.push(
      new Promise((resolve, reject) => {
        const ProfileInstance = new Profile(profiles[i])
        ProfileInstance.save((err, Profile) => {
          if (err) {
            reject()
          } else {
            profileInstances.push(Profile)
            resolve()
          }
        })
      }
    ))
  }

  await Promise.all(profilePromises)

  return res.json(profileInstances)
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

const updateProfileDb = Profile => {
  return new Promise((resolve, reject) => {
    Profile.save((err, newProfile) => {
      if (err)
        reject({
          message: err,
        })
      resolve(newProfile)
    })
  })
}
