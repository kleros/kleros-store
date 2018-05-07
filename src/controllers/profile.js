import _ from 'lodash'
import Profile from '../models/Profile'
import constants from '../constants'
import getFakeData from './fake-data'
import { getTimestampedToken } from '../util/auth'


export const updateProfile = async (req, res) => {
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
      return res.status(201).json(Profile)
    }
  })
}

export const updateContractProfile = async (req, res) => {
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

  res.status = 201
  return res.json([
    NewProfile,
    NewSecondProfile
  ])
}

export const addEvidenceContractProfile = async (req, res) => {
  const address = req.params.address
  const contractAddress = req.params.contractAddress
  const evidenceContract = req.body

  // force the correct address
  evidenceContract.address = contractAddress

  let ProfileInstance = await getProfileDb(address)

  // if not exists, we create this new user
  if (_.isNull(ProfileInstance))
    throw new Error('Profile does not exist')

  const indexContract = ProfileInstance.contracts.findIndex(
    contract => contract.address === contractAddress
  )

  await ProfileInstance.contracts[indexContract].evidences.push(evidenceContract)

  const NewProfile = await updateProfileDb(ProfileInstance)

  return res.json(NewProfile)
}

export const updateDisputesProfile = async (req, res) => {
  const address = req.params.address
  const disputeId = parseInt(req.params.disputeId)
  const arbitratorAddress = req.params.arbitratorAddress

  const ProfileInstance = await getProfileDb(address)

  const indexContract = _.findIndex(ProfileInstance.disputes, dispute =>
    (dispute.disputeId === disputeId && dispute.arbitratorAddress === arbitratorAddress)
  )

  if (indexContract >= 0) {
    ProfileInstance.disputes[indexContract] = req.body
  } else {
    ProfileInstance.disputes.push(
      req.body
    )
  }

  const NewProfile = await updateProfileDb(ProfileInstance)

  return res.json(NewProfile)
}

export const getProfileByAddress = async (req, res) => {
  try {
    const ProfileInstance = await getProfileDb(req.params.address)
    res.json(ProfileInstance)
  } catch (e) {
    res.send(e)
  }
}

export const addFakeProfiles = async (req, res) => {
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

export const addNotification = async (req, res) => {
  const address = req.params.address
  const txHash = req.params.txHash
  const notficationDetails = req.body
  let ProfileInstance = await getProfileDb(address)

  if (_.isNull(ProfileInstance))
    return res.status(400).json({"message": `Profile ${address} does not exist`})

  const indexContract = ProfileInstance.notifications.findIndex(
    notification => {
      return (notification.txHash === txHash && notification.logIndex === notficationDetails.logIndex)
    }
  )

  // if we have already seen it don't add another
  if (indexContract === -1) {
    const newNotification = {
      txHash,
      ...notficationDetails
    }
    ProfileInstance.notifications.push(newNotification)
    const NewProfile = await updateProfileDb(ProfileInstance)
    return res.status(201).json(NewProfile)
  } else {
    return res.status(304).json(ProfileInstance)
  }
}

export const requestNewToken = async (req, res) => {
  const address = req.params.address

  // Fetch a token that will be valid until config.authTokenLengthSeconds or when a new token is requested
  const unsignedToken = getTimestampedToken()
  let ProfileInstance = await getProfileDb(address)
  // Create a new user profile if one does not exist
  if (!ProfileInstance)
    ProfileInstance = new Profile( { address: address } )
  ProfileInstance.authToken = unsignedToken
  const working = await updateProfileDb(ProfileInstance)
  console.log(working)

  return res.status(200).json({unsignedToken})
}

export const getProfileDb = address => {
  return new Promise((resolve, reject) => {
    Profile
      .findOne({address})
      .sort('-created_at')
      .exec(
        (err, profile) => {
          if (err) {
            reject(err)
          }
          resolve(profile)
        }
      )
  })
}

export const updateProfileDb = Profile => {
  return new Promise((resolve, reject) => {
    Profile.save((err, newProfile) => {
      if (err) {
        reject({
          message: err,
        })
      }
      resolve(newProfile)
    })
  })
}
