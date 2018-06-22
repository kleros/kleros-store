import app from '../src/app'
import request from 'supertest'
import seed from '../src/seed'

describe('User Profile', () => {
  beforeAll(async () => {
    await seed()
  })

  test('creates a new user profile', async () => {
    const testAddress = "0x0"

    let response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.contracts.length).toBe(0)
    expect(response.body.lastBlock).toBeFalsy()
  })

  test('fails when trying to overwrite profile', async () => {
    const testAddress = "0x1"

    let response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)

    response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(403)
  })

  test('update last block', async () => {
    const testAddress = "0x2"

    let response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)

    // try it again with different params. Should fail
    const newBody = {
      lastBlock: 1,
    }

    response = await request(app)
      .post(`/${testAddress}/lastBlock`)
      .send(newBody)

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.lastBlock).toEqual(newBody.lastBlock)
  })

  test('update session', async () => {
    const testAddress = "0x3"

    let response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)

    // try it again with different params. Should fail
    const newBody = {
      session: 34,
    }

    response = await request(app)
      .post(`/${testAddress}/session`)
      .send(newBody)

    expect(response.statusCode).toBe(201)
    expect(response.body.address).toEqual(testAddress)
    expect(response.body.session).toEqual(newBody.session)
  })

  test('get profile by address', async () => {
    const testAddress = "0x4"

    let response = await request(app)
      .post(`/${testAddress}`)
      .send()

    expect(response.statusCode).toBe(201)

    response = await request(app).get(`/${testAddress}`)

    expect(response.statusCode).toBe(200)
    expect(response.body.address).toEqual(testAddress)
  })
})
