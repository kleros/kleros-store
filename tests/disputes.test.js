import app from '../src/app'
import request from 'supertest'
import seed from '../src/seed'

describe('Disputes', () => {
  const arbitratorAddress = "0x1"

  beforeAll(async () => {
    await seed()
  })

  test('create new dispute in user profile', async () => {
    // use a new address for each user profile
    const testAddress = '0x0' + Math.random()
    // create user profile
    await request(app)
      .post(`/${testAddress}`)
      .send()

    const disputeId = 0

    const disputeBody = {}

    let response = await request(app)
      .post(`/${testAddress}/arbitrators/${arbitratorAddress}/disputes/${disputeId}`)
      .send(disputeBody)

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.disputes.length).toBe(1)
    expect(response.body.disputes[0].arbitratorAddress).toBe(arbitratorAddress)
    expect(response.body.disputes[0].disputeId).toBe(disputeId)
  }),
  test('update existing dispute in userProfile', async () => {
    // use a new address for each user profile
    const testAddress = '0x0' + Math.random()
    // create user profile
    await request(app)
      .post(`/${testAddress}`)
      .send()

    const disputeId = 0

    let response = await request(app)
      .post(`/${testAddress}/arbitrators/${arbitratorAddress}/disputes/${disputeId}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.disputes.length).toBe(1)
    expect(response.body.disputes[0].arbitratorAddress).toBe(arbitratorAddress)
    expect(response.body.disputes[0].disputeId).toBe(disputeId)

    // update profile won't overwrite existing params
    const disputeBody = {
      appealDraws: [[1]]
    }

    response = await request(app)
      .post(`/${testAddress}/arbitrators/${arbitratorAddress}/disputes/${disputeId}`)
      .send(disputeBody)

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.disputes.length).toBe(1)
    expect(response.body.disputes[0].arbitratorAddress).toBe(arbitratorAddress)
    expect(response.body.disputes[0].disputeId).toBe(disputeId)
    expect(response.body.disputes[0].appealDraws).toBeTruthy()
    expect(response.body.disputes[0].appealDraws.length).toBe(0)
  })
})
