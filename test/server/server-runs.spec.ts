import request from 'supertest'
import { expect } from 'chai'

import createServer from 'server'
const app = createServer()

describe('Server checks', () => {
  it('server is created without error', (done) => {
    request(app).get("/").expect(200, done)
  })
})