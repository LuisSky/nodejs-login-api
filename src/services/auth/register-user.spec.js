const RegisterUserService = require('./register-user.js')
const { MissingParamError, ValidationError } = require('../../utils/errors')
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
      this.hashString = 'hash_string'
      return this.hashString
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
  test('Should throw if no UserRepository is provided', async () => {
    const sut = new RegisterUserService()
    const credentials = {
      email: 'any_email@email.com',
      password: 'any_password'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrowError(new MissingParamError('UserRepository'))
  })

  test('Should throw if no EncrypterHelper is provided', async () => {
    const sut = new RegisterUserService({ userRepository: makeUserRepositorySpy() })

    const credentials = {
      email: 'any_email@email.com',
      password: 'any_password'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrowError(new MissingParamError('EncrypterHelper'))
  })

  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      password: 'any_password'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrowError(new ValidationError('email'))
  })

  test('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      email: 'any_email@mail.com'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrowError(new ValidationError('password'))
  })

  test('Should throw if no User alread exists', async () => {
    const { sut, userRepoSpy } = makeSut()
    userRepoSpy.mockExistUser = true

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrowError(new ValidationError('this user alread exist'))
  })

  test('Should call EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    await sut.execute(credentials)

    expect(encrypterHelperSpy.string).toBe('any_pass')
  })

  test('Should call UserRepository with correct params', async () => {
    const { sut, encrypterHelperSpy, userRepoSpy } = makeSut()

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    const user = await sut.execute(credentials)

    expect(userRepoSpy.email).toBe('any_email@mail.com')
    expect(encrypterHelperSpy.string).toBe('any_pass')
    expect(userRepoSpy.password).toBe(user.password)
  })

  test('Should returns an user if valid email and password is provided', async () => {
    const { sut, userRepoSpy } = makeSut()

    const credentials = {
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
    const user = await sut.execute(credentials)

    expect(user.email).toBe('valid_email@mail.com')
    expect(user.password).toBe(userRepoSpy.password)
  })
})
