import request from 'supertest'
import { ec } from 'elliptic'
import { keccak256 } from 'js-sha3'

import authMiddleware from '../src/middleware/auth'
import app from '../src/app'

const fakePrivate = '0x0'

describe('Authentication', () => {
  let keypair
  let address

  beforeAll(async () => {
    process.env.NODE_ENV = 'production'
    // generate keypair for signing token
    const EC = new ec('secp256k1')
    keypair = EC.keyFromPrivate(fakePrivate)
    // Get address. Get pub key in uncompressed format
    const publicKey = keypair.getPublic().encode('hex').slice(2);
    // Hash pub key
    address = '0x' + keccak256(Buffer.from(publicKey, 'hex')).slice(64 - 40);
  })

  test('can get auth token if no user profile', async () => {
    const tokenResponse = await request(app).get(
      `/${address}/authToken`
    )
    expect(tokenResponse.statusCode).toBe(200)
    expect(tokenResponse.body.unsignedToken).toBeTruthy()

    const getProfile = await request(app).get(
      `/${address}`
    )
    expect(getProfile.status).toBe(200)
    expect(getProfile.body.address).toEqual(address)
  })

  test('fails if token is missing', async () => {
    const newProfileData = {
      lastBlock: 1
    }
    let response = await request(app)
      .post(`/${address}`)
      .send(newProfileData)
    expect(response.statusCode).toBe(401)
    const error_message = JSON.parse(response.text).error
    expect(error_message).toEqual('Missing authorization token.')
  })

  test('fails if sig is invalid', async () => {
    const tokenResponse = await request(app).get(
      `/${address}/authToken`
    )
    expect(tokenResponse.statusCode).toBe(200)
    expect(tokenResponse.body.unsignedToken).toBeTruthy()

    const fakeSig = '0x0d1e6719ed4bf28f4ac8dc4bf95daa18b8d9d4cf3247b9f374cb5469251fd54476bc6b38e0ffdc46088b9c07a097ddd2d0a4c0dd066c108338edd21412af04ef1b'
    let response = await request(app)
      .post(`/${address}`)
      .set('Authorization', fakeSig)
      .send({})
    expect(response.statusCode).toBe(401)
    const error_message = JSON.parse(response.text).error
    expect(error_message).toEqual('Auth Token signature is invalid.')
  })
})
