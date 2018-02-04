const app = require('../app')
const request = require('supertest')

describe('Disputes', () => {
  test('add subscriber to dispute', async () => {
    const testArbitratorAddress = "0x0"
    const testDisputeId = 1
    const testSubscriberAddress = "0x1"

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
    expect(response.body.subscribers.length).toBe(0)

    response = await request(app)
      .post(`/arbitrators/${testArbitratorAddress}/disputes/${testDisputeId}/subscribers`)
      .send({
        address: testSubscriberAddress
      })

    expect(response.statusCode).toBe(201)
    expect(response.body.subscribers.length).toBe(1)
    expect(response.body.subscribers[0]).toEqual(testSubscriberAddress)
  })
})
