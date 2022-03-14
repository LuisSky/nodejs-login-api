const RegisterUserService = require('./register-user.js')
const { MissingParamError, ValidationError } = require('../../helpers/errors')
// const makeSut = () => {
//   return new UserService()
// }
const makeUserRepositorySpy = () => {
  class UserRepositorySpy {
    async findOne ({ email }) {
      return this.mockExistUser
    }
  }
  return new UserRepositorySpy()
}

const makeEncrypterHelperSpy = () => {
  class EncrypterHelperSpy {

  }
  return new EncrypterHelperSpy()
}

const makeSut = () => {
  const userRepoSpy = makeUserRepositorySpy()
  const sut = new RegisterUserService({ userRepository: userRepoSpy, encrypterHelper: makeEncrypterHelperSpy() })

  return {
    userRepoSpy,
    sut
  }
}

describe('UserService', () => {
  it('Should throw if no UserRepository is provided', async () => {
    const sut = new RegisterUserService()
    const promise = sut.execute('any_mail@mail.com', 'any_pass')
    expect(promise).rejects.toThrowError(new MissingParamError('UserRepository'))
  })

  it('Should throw if no EncrypterHelper is provided', async () => {
    const sut = new RegisterUserService({ userRepository: makeUserRepositorySpy() })
    const promise = sut.execute('any_mail@mail.com', 'any_pass')
    expect(promise).rejects.toThrowError(new MissingParamError('EncrypterHelper'))
  })

  it('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute('any_pass')

    expect(promise).rejects.toThrowError(new ValidationError('email'))
  })

  it('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.execute('any_email@mail.com')

    expect(promise).rejects.toThrowError(new ValidationError('Password'))
  })

  it('Should throw if no User alread exists', async () => {
    const { sut, userRepoSpy } = makeSut()
    userRepoSpy.mockExistUser = true
    const promise = sut.execute('any_email@mail.com', 'any_pass')

    expect(promise).rejects.toThrowError(new ValidationError('this user alread exist'))
  })
})
