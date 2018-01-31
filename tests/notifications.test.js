const app = require('../app')
const request = require('supertest')

describe('Notifications', () => {
  test('adds notification to profile', async () => {
    try {
      const testAddress = "0x0"
      // add new profile
      console.log("ready to start")
      let response = await request(app).post(`/${testAddress}`)
      console.log("posted new profile")
      expect(response.statusCode).toBe(201)
      expect(response.body.address).toBe(testAddress)
      console.log("everything checked out")

      const testNotification = {
        notificationType: 1,
        message: "Dispute has been ruled on",
        data: {
          disputeId: 0,
          ruling: 1
        }
      }

      console.log("ready to post notification")
      response = await request(app)
        .post(`/${testAddress}/notifications`)
        .send(testNotification)

      console.log("posted notification")
      expect(response.statusCode).toBe(201)
      expect(response.body.notifications.length).toBe(1)
      const returnedNotification = response.body.notifications[0]
      expect(returnedNotification.type).toBe(testNotification.type)
      expect(returnedNotification.message).toBe(testNotification.message)
      expect(returnedNotification.data).toEqual(testNotification.data)
      expect(returnedNotification.created_at).toBeTruthy()
    } catch (e) {
      console.log(e)
      throw e
    }
  })
})
