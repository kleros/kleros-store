import app from '../src/app'
import request from 'supertest'
import seed from '../src/seed'

describe('Notifications', () => {
  beforeAll(async () => {
    await seed()
  })

  test('adds notification to profile', async () => {
    const testAddress = "profile1"
    const testTxHash = "0x1"

    const testNotification = {
      notificationType: 1,
      message: "Dispute has been ruled on",
      logIndex: 1,
      data: {
        disputeId: 0,
        ruling: 1
      }
    }

    let response = await request(app)
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

  test('mark notification as read', async () => {
    const testAddress = "profile1"
    const testTxHash = "0x2"

    const testNotification = {
      notificationType: 1,
      message: "Dispute has been ruled on",
      logIndex: 0,
      data: {
        disputeId: 0,
        ruling: 1
      }
    }

    let response = await request(app)
      .post(`/${testAddress}/notifications/${testTxHash}`)
      .send(testNotification)

    expect(response.statusCode).toBe(201)
    expect(response.body.notifications.read).toBeFalsy()

    const body = {
      logIndex: 0,
      isRead: true
    }
    // try it again. should receive 304
    response = await request(app)
      .post(`/${testAddress}/notifications/${testTxHash}/read`)
      .send(body)

    expect(response.statusCode).toBe(201)
    const indexContract = response.body.notifications.findIndex(
      notification => {
        return (notification.txHash === testTxHash && notification.logIndex === testNotification.logIndex)
      }
    )
    const notification = response.body.notifications[indexContract]
    expect(notification.read).toBeTruthy()
  })
})
