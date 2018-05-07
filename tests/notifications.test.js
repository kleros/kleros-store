import app from '../src/app'
import request from 'supertest'

describe('Notifications', () => {
  test('adds notification to profile', async () => {
    const testAddress = "0x0"
    const testTxHash = "0x1"
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
      .post(`/${testAddress}/notifications/${testTxHash}`)
      .send(testNotification)

    expect(response.statusCode).toBe(201)
    expect(response.body.notifications.length).toBe(1)
    const returnedNotification = response.body.notifications[0]
    expect(returnedNotification.notificationType).toBe(testNotification.notificationType)
    expect(returnedNotification.message).toBe(testNotification.message)
    expect(returnedNotification.data).toEqual(testNotification.data)
    expect(returnedNotification.created_at).toBeTruthy()
    expect(returnedNotification.txHash).toBeTruthy()
    expect(returnedNotification.read).toBe(false)

    // try it again. should receive 304
    response = await request(app)
      .post(`/${testAddress}/notifications/${testTxHash}`)
      .send(testNotification)

    expect(response.statusCode).toBe(304)
  })
})
