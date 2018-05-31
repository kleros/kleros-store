const app = require('../app')
const request = require('supertest')

describe('Disputes', () => {
  test('add subscriber to dispute', async () => {
    const testArbitratorAddress = "0x0" + Math.random()
    const testDisputeId = 1

    const fakeDispute = {
      disputeId: testDisputeId,
      arbitratorAddress: testArbitratorAddress
    }
    // add new dispute
    let response = await request(app).post(
      `/arbitrators/${testArbitratorAddress}/disputes/${testDisputeId}`
    ).send(fakeDispute)
    expect(response.statusCode).toBe(201)
    expect(response.body.disputeId).toBe(testDisputeId)
    expect(response.body.arbitratorAddress).toBe(testArbitratorAddress)
  })
})
