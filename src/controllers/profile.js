import _ from 'lodash'
import Profile from '../models/Profile'
import getFakeData from './fake-data'
import { getTimestampedToken } from '../util/auth'

export const newUserProfile = async (req, res) => {
  const address = req.params.address

  const ProfileInstance = await getProfileDb(address)
  if (ProfileInstance)
    return res.status(403).json({
      message: 'Cannot overwrite existing user profile'
    })

  const newProfileInstance = new Profile(
    {
      address: address,
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

export const updateLastBlock = async (req, res) => {
  const address = req.params.address
  const newLastBlock = req.body.lastBlock

  if (!newLastBlock)
  return res.status(400).json(
    { message: `Required params: lastBlock <int>` }
  )

  let ProfileInstance = await getProfileDb(address)

  // create new user if no user profile exists
  if (_.isNull(ProfileInstance)) {
    ProfileInstance = new Profile(
      {
        address: address,
      }
    )
  }

  ProfileInstance.lastBlock = newLastBlock

  const NewProfile = await updateProfileDb(ProfileInstance)

  return res.status(201).json(NewProfile)
}

export const updateContractProfile = async (req, res) => {
  const address = req.params.address
  const contractAddress = req.params.contractAddress
  const bodyContract = req.body

  // force the correct address
  bodyContract.address = req.params.contractAddress

  // check required params
  if (!bodyContract.partyA || !bodyContract.partyB)
    return res.status(400).json(
      { message: `Required params: partyA <address>, partyA <address>` }
    )

  // address must be one of partyA or partyB
  if (address !== bodyContract.partyA || address !== bodyContract.partyB) {
    return res.status(403).json(
      { message: "Cannot update contract profile for user that is not a counterparty" }
    )
  }

  let ProfileInstance = await getProfileDb(address)

  // create new user if no user profile exists
  if (_.isNull(ProfileInstance)) {
    ProfileInstance = new Profile(
      {
        address: address
      }
    )
  }

  const _updateContractProfileInstance = (_profileInstance) => {
    // see if contract already exists in user profile
    const contractIndex = _.indexOf(
      _profileInstance.contracts,
      contract =>
        contract.address === contractAddress
    )
    if (contractIndex >= 0) {
      // Add new data but do not overwrite any data previously in contract.
      // NOTE: Nested objects cannot be updated with this method unless they do not exist.
      _profileInstance.contracts[contractIndex] =
        {
          ...bodyContract,
          ..._profileInstance.contracts[contractIndex].toObject()
        }
    } else {
      // add the new contract
      _profileInstance.contracts.push(bodyContract)
    }
  }

  ProfileInstance = _updateContractProfileInstance(ProfileInstance)

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

  SecondProfileInstance = _updateContractProfileInstance(SecondProfileInstance)

  const [NewProfile, NewSecondProfile] = await Promise.all([
    updateProfileDb(ProfileInstance),
    updateProfileDb(SecondProfileInstance),
  ])

  return res.status(201).json([
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
  return res.status(401).json(
    { message: "User profile does not exist" }
  )

  const indexContract = ProfileInstance.contracts.findIndex(
    contract => contract.address === contractAddress
  )

  if (indexContract < 0)
    return res.status(401).json(
      { message: "Contract does not exist in User Profile" }
    )

  await ProfileInstance.contracts[indexContract].evidences.push(evidenceContract)

  const NewProfile = await updateProfileDb(ProfileInstance)

  return res.status(201).json(NewProfile)
}

export const updateDisputesProfile = async (req, res) => {
  const address = req.params.address
  const disputeId = parseInt(req.params.disputeId)
  const arbitratorAddress = req.params.arbitratorAddress

  const ProfileInstance = await getProfileDb(address)
  // if not exists, we create this new user
  if (_.isNull(ProfileInstance))
  return res.status(401).json(
    { message: "User profile does not exist" }
  )

  const indexDispute = _.findIndex(ProfileInstance.disputes, dispute =>
    (dispute.disputeId === disputeId && dispute.arbitratorAddress === arbitratorAddress)
  )

  if (indexDispute >= 0) {
    const dispute = ProfileInstance.disputes[indexDispute].toObject()
    // add new data but do not overwrite anything
    ProfileInstance.disputes[indexDispute] = {
      ...req.body,
      ...dispute,
      arbitratorAddress,
      disputeId,
    }
  } else {
    ProfileInstance.disputes.push(
      { ...req.body, disputeId, arbitratorAddress }
    )
  }

  const NewProfile = await updateProfileDb(ProfileInstance)

  return res.status(201).json(NewProfile)
}

export const addNewDrawsDisputeProfile = async (req, res) => {
  const address = req.params.address
  const disputeId = parseInt(req.params.disputeId)
  const arbitratorAddress = req.params.arbitratorAddress

  const ProfileInstance = await getProfileDb(address)

  const indexDispute = _.findIndex(ProfileInstance.disputes, dispute =>
    (dispute.disputeId === disputeId && dispute.arbitratorAddress === arbitratorAddress)
  )

  if (indexDispute < 0)
    return res.status(400).json({
      message: "Dispute not found in user profile"
    })

  // required params
  if (!req.body.draws || !req.body.appeal)
    return res.status(400).json({
      message: "Missing required param. Required params: appeal <int>, draws <int>[]"
    })

  // draws already exist for appeal
  if (ProfileInstance.disputes[disputeId].appealDraws[req.body.appeal])
    return res.status(403).json({
      message: "Draws already stored for appeal"
    })

  // update user profile
  ProfileInstance.disputes[disputeId].appealDraws[req.body.appeal] = req.body.draws

  const NewProfile = await updateProfileDb(ProfileInstance)
  return res.status(201).json(NewProfile)
}

export const getProfileByAddress = async (req, res) => {
  try {
    const ProfileInstance = await getProfileDb(req.params.address)
    res.status(200).json(ProfileInstance)
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
    return res.status(400).json({message: `Profile ${address} does not exist`})

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
