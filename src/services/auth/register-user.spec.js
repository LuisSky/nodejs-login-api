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

    async createOne ({ email, password } = {}) {
      this.email = email
      this.password = password
      return { email: this.email, password: this.password }
    }
  }
  const userRepositorySpy = new UserRepositorySpy()
  userRepositorySpy.mockExistUser = false
  return userRepositorySpy
}

const makeEncrypterHelperSpy = () => {
  class EncrypterHelperSpy {
    hash (string) {
      this.string = string
      return this.string
    }
  }

  const encrypterHelperSpy = new EncrypterHelperSpy()
  return encrypterHelperSpy
}

const makeSut = () => {
  const userRepoSpy = makeUserRepositorySpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const sut = new RegisterUserService({ userRepository: userRepoSpy, encrypterHelper: encrypterHelperSpy })

  return {
    userRepoSpy,
    encrypterHelperSpy,
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

  it('Should call EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    await sut.execute('any_email@mail.com', 'any_pass')

    expect(encrypterHelperSpy.string).toBe('any_pass')
  })

  it('Should call UserRepository with correct params', async () => {
    const { sut, userRepoSpy } = makeSut()

    await sut.execute('any_email@mail.com', 'any_pass')

    console.log(userRepoSpy)
    expect(userRepoSpy.email).toBe('any_email@mail.com')
    expect(userRepoSpy.password).toBe('any_pass')
  })
})
