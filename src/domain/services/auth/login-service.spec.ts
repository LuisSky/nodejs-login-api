// TODO: Create test's when an dependencys fail

import { MissingParamError } from '../../../utils/errors'
import LoginService from './login-service'

const makeUserRepoSpy = () => {
  
  class UserRepositorySpy {
    email = ''
    foundUser = false
    async findByEmail (email: string) {
      this.email = email
      return this.foundUser
    }
    createOne() {
      return ''
    }
  }
  const userRepoSpy = new UserRepositorySpy()
  userRepoSpy.foundUser = true

  return userRepoSpy
}

const makeEncrypterHelperSpy = () => {
  class EncrypterHelperSpy {
    strWithoutHash = ''
    validCase = false
    hash(){
    }
    async compare (string: string, hashString: string) {
      this.strWithoutHash = string
      return this.validCase
    }
  }
  const encrypterHelperSpy = new EncrypterHelperSpy()
  encrypterHelperSpy.validCase = true
  return encrypterHelperSpy
}

const makeTokenGeneratorSpy = () => {
  
  class TokenGeneratorSpy {
    async generate (payload: any) {
      return 'valid_token'
    }
    decode() {
      
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  return tokenGeneratorSpy
}
const makeSut = () => {
  const userRepoSpy = makeUserRepoSpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()

  const sut = new LoginService(userRepoSpy, encrypterHelperSpy, tokenGeneratorSpy)

  return {
    sut,
    userRepoSpy,
    encrypterHelperSpy,
    tokenGeneratorSpy
  }
}

describe('LoginService', () => {
  
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.execute('', 'any_password')

    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()

    const promise = sut.execute('any_email@mail.com', '')

    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should calls UserRepository with correct params', async () => {
    const { sut, userRepoSpy } = makeSut()

    await sut.execute('any_email@mail.com', 'any_password')

    expect(userRepoSpy.email).toBe('any_email@mail.com')
  })

  test('Should return null if UserRepository do not found user', async () => {
    const { sut, userRepoSpy } = makeSut()
    userRepoSpy.foundUser = false
    const user = await sut.execute('any_email@mail.com', 'any_password')

    expect(user).toBeNull()
  })

  test('Should calls EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()
    await sut.execute('any_email@mail.com', 'any_password')

    expect(encrypterHelperSpy.strWithoutHash).toBe('any_password')
  })

  test('Should return null if EncrypterHelper returns null', async () => {
    const { sut, encrypterHelperSpy } = makeSut()
    encrypterHelperSpy.validCase = false
    const response = await sut.execute('invalid_email@mail.com', 'invalid_password')

    expect(response).toBeNull()
  })

  test('Should return token if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const token = await sut.execute('valid_email@mail.com', 'valid_password')

    expect(token).toBe('valid_token')
  })
})
