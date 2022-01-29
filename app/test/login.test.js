const app = require('../app')
const request = require('supertest')

describe('test', () => {

  // beforeAll(async (done) => {
  // })

  it('login: invalid', async () => {
    return request(app).post('/login')
    .send({})
    .then((result) => {
      expect(result.statusCode).toBe(400)
    })
  })

  it('login: success', async () => {
    return request(app).post('/login')
    .set('Content-type', 'application/json')
    .set('X-Requested-With', 'XMLHttpRequest')
    .set('host', '172.30.0.2:3000')
    .set('origin', 'https://localhost:8080')
    .send(JSON.stringify({
      email: 'tsuyo.1991+01@gmail.com',
      password: 'test',
    }))
    .then((result) => {
      expect(result.statusCode).toBe(200)
    })
  })

  // afterAll(async () => {
  // })
})