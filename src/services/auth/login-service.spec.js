const { ServerError } = require('../../utils/errors')
const LoginService = require('./login-service')

const makeUserRepoSpy = () => {
  class UserRepositorySpy {
    async findOne () {
    }
  }
  const userRepoSpy = new UserRepositorySpy()
  return userRepoSpy
}

const makeEncrypterHelperSpy = () => {
  class EncrypterHelperSpy {

  }
  const encrypterHelperSpy = new EncrypterHelperSpy()
  return encrypterHelperSpy
}

const makeSut = () => {
  const userRepoSpy = makeUserRepoSpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const sut = new LoginService({ userRepository: userRepoSpy, encryptHelper: encrypterHelperSpy })
  return {
    sut,
    userRepoSpy,
    encrypterHelperSpy
  }
}

describe('LoginService', () => {
  test('Should throw if no UserRepository is provided', async () => {
    const sut = new LoginService()
    const promise = sut.verifyLogin()
    await expect(promise).rejects.toEqual(new ServerError())
  })

  test('Should throw if no EncrypterHelper is provided', async () => {
    const { userRepoSpy } = makeSut()
    const sut = new LoginService({ userRepository: userRepoSpy })
    const promise = sut.verifyLogin()
    await expect(promise).rejects.toEqual(new ServerError())
  })
})
