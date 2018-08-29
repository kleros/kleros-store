import app from '../src/app'
import request from 'supertest'
import seed from '../src/seed'

describe('Contracts', () => {
  const arbitratorAddress = "0x1"

  beforeAll(async () => {
    await seed()
  })

  test('create new contract in user profile', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    const contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      metaEvidence: {
        description: 'test description',
        title: 'test title'
      }
    }

    // create user profile
    const response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(201)
    expect(response.body.length).toEqual(2)
    const partyAProfile = response.body[0]
    expect(partyAProfile.address).toEqual(testAddressPartyA)
    expect(partyAProfile.contracts.length).toEqual(1)
    expect(partyAProfile.contracts[0].arbitrableTransactionId).toEqual(contractBody.arbitrableTransactionId)
    expect(partyAProfile.contracts[0].email).toEqual(contractBody.email)
    expect(partyAProfile.contracts[0].metaEvidence.description).toEqual(contractBody.metaEvidence.description)
    expect(partyAProfile.contracts[0].metaEvidence.title).toEqual(contractBody.metaEvidence.title)
    const partyBProfile = response.body[1]
    expect(partyBProfile.address).toEqual(testAddressPartyB)
    expect(partyBProfile.contracts.length).toEqual(1)
    expect(partyBProfile.contracts[0].arbitrableTransactionId).toEqual(contractBody.arbitrableTransactionId)
    expect(partyBProfile.contracts[0].email).toEqual(contractBody.email)
    expect(partyBProfile.contracts[0].metaEvidence.description).toEqual(contractBody.metaEvidence.description)
    expect(partyBProfile.contracts[0].metaEvidence.title).toEqual(contractBody.metaEvidence.title)
  }),
  test('cannot overwrite contract data', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    const contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      metaEvidence: {
        description: 'test description',
        title: 'test title'
      }
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(201)

    const updatedContractData = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'new@email.com',
      description: 'new description',
      title: 'new title'
    }

    response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(updatedContractData)

    expect(response.statusCode).toBe(201)
    expect(response.body.length).toEqual(2)
    const partyAProfile = response.body[0]
    expect(partyAProfile.address).toEqual(testAddressPartyA)
    expect(partyAProfile.contracts.length).toEqual(1)
    expect(partyAProfile.contracts[0].email).toEqual(updatedContractData.email)
    expect(partyAProfile.contracts[0].arbitrableTransactionId).toEqual(updatedContractData.arbitrableTransactionId)
    expect(partyAProfile.contracts[0].metaEvidence.description).toEqual(contractBody.metaEvidence.description)
    expect(partyAProfile.contracts[0].metaEvidence.title).toEqual(contractBody.metaEvidence.title)
    const partyBProfile = response.body[1]
    expect(partyBProfile.address).toEqual(testAddressPartyB)
    expect(partyBProfile.contracts.length).toEqual(1)
    expect(partyBProfile.contracts[0].email).toEqual(updatedContractData.email)
    expect(partyBProfile.contracts[0].metaEvidence.description).toEqual(contractBody.metaEvidence.description)
    expect(partyBProfile.contracts[0].metaEvidence.title).toEqual(contractBody.metaEvidence.title)
  }),
  test('new contract no partyA or partyB', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    let contractBody = {
      arbitrableTransactionId: 0,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      description: 'test description',
      title: 'test title'
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(400)

    contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      email: 'test@email.com',
      description: 'test description',
      title: 'test title'
    }

    // create user profile
    response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(400)
  }),
  test('new contract to different profile than parties', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()
    const testAddressPartyC = '0x0' + Math.random()

    const contractAddress = '0x0'
    let contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      description: 'test description',
      title: 'test title'
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyC}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(403)
  }),
  test('get metaEvidence from contract', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    const contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      metaEvidence: {
        description: 'test description',
        title: 'test title'
      }
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(201)

    response = await request(app).get(`/${testAddressPartyA}/contracts/${contractAddress}/meta-evidence`)
    expect(response.statusCode).toBe(200)
    expect(response.body.description).toEqual(contractBody.metaEvidence.description)
    expect(response.body.title).toEqual(contractBody.metaEvidence.title)
  }),
  test('add evidence to contract', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    let contractBody = {
      arbitrableTransactionId: 0,
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com'
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyB}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(201)

    const evidenceParams = {
      name: 'testEvidence',
      description: 'test description',
      URI: 'https://kleros.io',
      fileHash: '0x0'
    }

    response = await request(app)
      .post(`/${testAddressPartyB}/contracts/${contractAddress}/evidence`)
      .send(evidenceParams)

    expect(response.statusCode).toBe(201)
    // should return evidenceIndex
    expect(response.body.evidenceIndex).toEqual(0)

    // fetch evidence by evidenceIndex
    response = await request(app).get(`/${testAddressPartyB}/contracts/${contractAddress}/evidence/0`)
    expect(response.body).toBeTruthy()
    expect(response.body.name).toEqual(evidenceParams.name)
    expect(response.body.description).toEqual(evidenceParams.description)
    expect(response.body.URI).toEqual(evidenceParams.URI)
    expect(response.body.fileHash).toEqual(evidenceParams.fileHash)
  }),
  test('add evidence no user profile', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    const evidenceParams = {
      name: 'testEvidence',
      description: 'test description',
      url: 'https://kleros.io',
    }

    const response = await request(app)
      .post(`/${testAddressPartyB}/contracts/${contractAddress}/evidence`)
      .send(evidenceParams)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('User profile does not exist')
  }),
  test('add evidence no user profile', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    await request(app)
      .post(`/${testAddressPartyA}`)
      .send()

    const contractAddress = '0x0'
    const evidenceParams = {
      name: 'testEvidence',
      description: 'test description',
      url: 'https://kleros.io',
      submittedAt: 0
    }

    const response = await request(app)
      .post(`/${testAddressPartyA}/contracts/${contractAddress}/evidence`)
      .send(evidenceParams)

    expect(response.statusCode).toBe(400)
    expect(response.body.message).toEqual('Contract does not exist in User Profile')
  })
})
