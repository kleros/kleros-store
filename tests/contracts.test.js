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
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      description: 'test description',
      title: 'test title'
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
    expect(partyAProfile.contracts[0].email).toEqual(contractBody.email)
    expect(partyAProfile.contracts[0].description).toEqual(contractBody.description)
    expect(partyAProfile.contracts[0].title).toEqual(contractBody.title)
    const partyBProfile = response.body[1]
    expect(partyBProfile.address).toEqual(testAddressPartyB)
    expect(partyBProfile.contracts.length).toEqual(1)
    expect(partyBProfile.contracts[0].email).toEqual(contractBody.email)
    expect(partyBProfile.contracts[0].description).toEqual(contractBody.description)
    expect(partyBProfile.contracts[0].title).toEqual(contractBody.title)
  }),
  test('new contract no partyA or partyB', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    let contractBody = {
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
  test('add evidence to contract', async () => {
    // use a new address for each user profile
    const testAddressPartyA = '0x0' + Math.random()
    const testAddressPartyB = '0x0' + Math.random()

    const contractAddress = '0x0'
    let contractBody = {
      partyA: testAddressPartyA,
      partyB: testAddressPartyB,
      email: 'test@email.com',
      description: 'test description',
      title: 'test title'
    }

    // create user profile
    let response = await request(app)
      .post(`/${testAddressPartyB}/contracts/${contractAddress}`)
      .send(contractBody)

    expect(response.statusCode).toBe(201)

    const evidenceParams = {
      name: 'testEvidence',
      description: 'test description',
      url: 'https://kleros.io',
      submittedAt: 0
    }

    response = await request(app)
      .post(`/${testAddressPartyB}/contracts/${contractAddress}/evidence`)
      .send(evidenceParams)

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddressPartyB)
    expect(response.body.contracts.length).toEqual(1)
    expect(response.body.contracts[0].evidence.length).toEqual(1)
    expect(response.body.contracts[0].evidence[0].name).toEqual(evidenceParams.name)
    expect(response.body.contracts[0].evidence[0].description).toEqual(evidenceParams.description)
    expect(response.body.contracts[0].evidence[0].url).toEqual(evidenceParams.url)
    expect(response.body.contracts[0].evidence[0].submittedAt).toEqual(evidenceParams.submittedAt)
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
      submittedAt: 0
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
