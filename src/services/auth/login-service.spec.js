const { ServerError } = require('../../utils/errors')
const LoginService = require('./login-service')

const makeSut = () => {
  const loginService = new LoginService()
  return loginService
}

describe('LoginService', () => {
  test('Should throw if no UserRepository is provided', async () => {
    const sut = makeSut()
    const promise = sut.verifyLogin()
    await expect(promise).rejects.toEqual(new ServerError())
  })
})
