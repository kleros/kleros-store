import _ from 'lodash'
import Profile from '../models/Profile'
import getFakeData from './fake-data'
import { combineObjects } from '../util/combineObjects'

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

  const NewProfile = await saveProfileDb(ProfileInstance)

  return res.status(201).json(NewProfile)
}

export const updateSession = async (req, res) => {
  const address = req.params.address
  const currentSession = req.body.session

  if (!currentSession)
  return res.status(400).json(
    { message: `Required params: session <int>` }
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

  ProfileInstance.session = currentSession

  const NewProfile = await saveProfileDb(ProfileInstance)

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
  if (address !== bodyContract.partyA && address !== bodyContract.partyB) {
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
    const contractIndex = _profileInstance.contracts.findIndex(
      contract =>
        contract.address === contractAddress
    )
    if (contractIndex >= 0) {
      // Add new data but do not overwrite any data previously in contract.
      // NOTE: Nested objects cannot be updated with this method unless they do not exist.
      const newContract = combineObjects(_profileInstance.contracts[contractIndex].toObject(), bodyContract)
      _profileInstance.contracts[contractIndex] = newContract
    } else {
      // add the new contract
      _profileInstance.contracts.push(bodyContract)
    }

    return _profileInstance
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

  ProfileInstance.markModified('contracts')
  SecondProfileInstance.markModified('contracts')
  const [NewProfile, NewSecondProfile] = await Promise.all([
    saveProfileDb(ProfileInstance),
    saveProfileDb(SecondProfileInstance),
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
  return res.status(400).json(
    { message: "User profile does not exist" }
  )

  const indexContract = ProfileInstance.contracts.findIndex(
    contract => contract.address === contractAddress
  )

  if (indexContract < 0)
    return res.status(400).json(
      { message: "Contract does not exist in User Profile" }
    )

  await ProfileInstance.contracts[indexContract].evidence.push(evidenceContract)

  ProfileInstance.markModified('contracts')
  const NewProfile = await saveProfileDb(ProfileInstance)

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
    const newDispute = combineObjects(dispute, req.body)
    // add new data but do not overwrite anything
    ProfileInstance.disputes[indexDispute] = {
      ...newDispute,
      arbitratorAddress,
      disputeId,
    }
  } else {
    ProfileInstance.disputes.push(
      { ...req.body, disputeId, arbitratorAddress }
    )
  }

  ProfileInstance.markModified('disputes')
  const NewProfile = await saveProfileDb(ProfileInstance)

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
  if (req.body.draws === undefined || req.body.appeal === undefined)
    return res.status(400).json({
      message: "Missing required param. Required params: appeal <int>, draws <int>[]"
    })

  // draws already exist for appeal
  if (ProfileInstance.disputes[indexDispute].appealDraws[req.body.appeal] !== undefined)
    return res.status(403).json({
      message: "Draws already stored for appeal"
    })
  // update user profile
  ProfileInstance.disputes[indexDispute].appealDraws[req.body.appeal] = req.body.draws
  ProfileInstance.markModified('disputes')

  const NewProfile = await saveProfileDb(ProfileInstance)
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
    const NewProfile = await saveProfileDb(ProfileInstance)
    return res.status(201).json(NewProfile)
  } else {
    return res.status(304).json(ProfileInstance)
  }
}

export const markNotificationAsRead = async (req, res) => {
  const address = req.params.address
  const txHash = req.params.txHash
  const logIndex = req.body.logIndex
  const isRead = req.body.isRead

  const ProfileInstance = await getProfileDb(address)
  if (_.isNull(ProfileInstance))
    return res.status(400).json({message: `Profile ${address} does not exist`})

  const indexContract = ProfileInstance.notifications.findIndex(
    notification => {
      return (notification.txHash === txHash && notification.logIndex === logIndex)
    }
  )

  if (indexContract === -1)
    return res.status(400).json({
      message: `Notification with txHash: ${txHash} and log index: ${logIndex} does not exist.`
    })

  ProfileInstance.notifications[indexContract].read = isRead
  ProfileInstance.markModified('notifications')

  const updatedProfile = await saveProfileDb(ProfileInstance)
  return res.status(201).json(updatedProfile)
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

export const saveProfileDb = Profile => {
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
