const app = require('../app')
const request = require('supertest')

describe('GET /', () => {
  test('HTTP status + Api is working fine !', async () => {
    const { statusCode, text } = await request(app).get('/')

    expect(statusCode).toBe(200)
    expect(text).toBe('<!DOCTYPE html><html><head><title>Kleros store (API)</title><link rel=\"stylesheet\" href=\"/stylesheets/style.css\"></head><body><p>Kleros store (API)</p></body></html>')
  })
})
