const app = require('../app')
const request = require('supertest')

require('dotenv').config();

const agent = request.agent(app)
  .set('Content-type', 'application/json')
  .set('X-Requested-With', 'XMLHttpRequest')
  .set('host', process.env.APP_HOST)
  .set('origin', `https://${process.env.CLIENT_HOST}`)

const testUser = {
  name: 'テスト 太郎1',
  email: 'test1@gmail.com',
  password: 'secret',
}

describe('login', () => {

  it('missing origin => Blocked CSRF Check', async () => {
    return agent.post('/login')
    .unset('origin')//origin未設定
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(400)
    })
  })

  it('with invalid origin => Blocked CSRF Check', async () => {
    return agent.post('/login')
    .set('origin', 'https://sample.com')//不正なorigin
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(400)
    })
  })

  it('missing host => Blocked CSRF Check', async () => {
    return agent.post('/login')
    .unset('host')//hostが未設定
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(400)
    })
  })

  it('with invalid host => Blocked CSRF Check', async () => {
    return agent.post('/login')
    .set('host', '168.10.40.0:5555')//不正なhost
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(400)
    })
  })

  it('without X-Requested-With header => Blocked CSRF Check', async () => {
    return agent.post('/login')
    .unset('X-Requested-With')//X-Requested-Withが未設定
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(400)
    })
  })
  
  it('without Content-Type: application/json => Invalid Request', async () => {
    return agent.post('/login')
    .unset('Content-Type')//Content-Typeが未設定
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(403)
    })
  })

  it('missing email input', async () => {
    return agent.post('/login')
    .send(JSON.stringify({
      email: '',//Eメール未入力
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(403)
    })
  })

  it('missing password input', async () => {
    return agent.post('/login')
    .send(JSON.stringify({
      email: testUser.email,
      password: '',//パスワード未入力
    }))
    .then((res) => {
      expect(res.statusCode).toBe(403)
    })
  })

  it('attempt login at not exist user', async () => {
    return agent.post('/login')
    .send(JSON.stringify({
      email: 'missing@test.com',//Userに存在しないユーザ
      password: 'xxxxx',
    }))
    .then((res) => {
      expect(res.statusCode).toBe(403)
    })
  })

  it('success', async () => {
    return agent.post('/login')
    .send(JSON.stringify({
      email: testUser.email,
      password: testUser.password,
    }))
    .then((res) => {
      expect(res.statusCode).toBe(200)
      expect(res.body.name).toBe(testUser.name)
      expect(res.header["access-control-allow-credentials"]).toBe("true")
      expect(res.header["access-control-allow-origin"]).toBe(`https://${process.env.CLIENT_HOST}`)
    })
  })
})