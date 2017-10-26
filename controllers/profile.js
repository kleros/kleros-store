const _ = require('lodash')
const Profile = require('../models/Profile'),
      constants = require('../constants')

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

  if (_.isNull(ProfileInstance))
    return res.status(400).send({message: 'Profile not found'})

  const secondAddress = (bodyContract.partyA === address)
    ? bodyContract.partyB
    : bodyContract.partyA


  let SecondProfileInstance = await getProfileDb(secondAddress)
  if (_.isNull(SecondProfileInstance))
    return res.status(400).send({message: 'Second profile not found'})

  // remove the older contract
  let contracts = ProfileInstance.contracts.filter(contract => {
      return contract.address !== contractAddress
  })

  // add the new contract
  contracts.push(bodyContract)

  // update the contract in the profile
  ProfileInstance.contracts = contracts
  SecondProfileInstance.contracts = contracts

  const updateProfile = await updateProfileDb(ProfileInstance)

  const [NewProfile, NewSecondProfile] = await Promise.all([
    updateProfileDb(ProfileInstance),
    updateProfileDb(SecondProfileInstance),
  ])

  if (typeof updateProfile !== Profile)
    return res.status(400).send(updateProfile)

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

exports.addFakeProfile = (req, res) => {
  const ProfileInstance = new Profile({
    address: '0xAcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
    contracts: [
      {
        address: '0x6f9410a8c4d037bb2c82174c7c9fd9266d34563e',
        hash : 'l88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
        partyA : '0xAcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        partyB : '0xBcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        email: 'open@bazar.fr',
        description: 'description',
        evidencePartyA: [
          {
            hash: 'b88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            documentContent: 'myEvidence'
          },
          {
            hash: 'w88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            documentContent: 'myEvidence'
          }
        ],
        evidencePartyB: [
          {
            hash: 'fx8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            documentContent: 'myEvidence'
          },
          {
            hash: 'a88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
            documentContent: 'myEvidence'
          }
        ],
      },
    ],
    disputes: [
      {
        hash : 'f88df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
        partyA: '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        partyB: '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        contractAddress : '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        justification: 'justification'
      },
      {
        hash : 'as8df39fd7fe94897c2ff7ea9eb98590ed7ecc11a6e499b64a75bb5136311712',
        partyA: '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        partyB: '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        contractAddress : '0xDcB2db3E3fA7a6cba5dFE964408099d860246D7Z',
        justification: 'justification'
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
