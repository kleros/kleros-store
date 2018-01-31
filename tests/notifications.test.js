const app = require('../app')
const request = require('supertest')

describe('Notifications', () => {
  test('adds notification to profile', async () => {
    const testAddress = "0x0"
    // add new profile
    let response = await request(app).post(`/${testAddress}`)
    expect(response.statusCode).toBe(201)
    expect(response.body.address).toBe(testAddress)

    const testNotification = {
      notificationType: 1,
      message: "Dispute has been ruled on",
      data: {
        disputeId: 0,
        ruling: 1
      }
    }

    response = await request(app)
      .post(`/${testAddress}/notifications`)
      .send(testNotification)

    expect(response.statusCode).toBe(201)
    expect(response.body.notifications.length).toBe(1)
    const returnedNotification = response.body.notifications[0]
    expect(returnedNotification.notificationType).toBe(testNotification.notificationType)
    expect(returnedNotification.message).toBe(testNotification.message)
    expect(returnedNotification.data).toEqual(testNotification.data)
    expect(returnedNotification.created_at).toBeTruthy()
  })
})
