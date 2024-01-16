// TODO: Create test's when an dependencys fail

import { MissingParamError } from '../../../utils/errors'
import { Encrypter, ITokenGenerator } from '../../../utils/protocols'
import { IFindUserByEmailRepository } from './interfaces'
import LoginService from './login-service'

const makeFindUserByEmailRepoSpy = (): IFindUserByEmailRepository => {
  class FindUserByEmailRepositorySpy implements IFindUserByEmailRepository {
    async findByEmail (email: string): Promise<any> {
      return { email, password: 'any_hash' }
    }
  }
  return new FindUserByEmailRepositorySpy()
}

const makeEncrypterHelperSpy = (): Encrypter => {
  class EncrypterHelperSpy implements Encrypter {
    hash (): string {
      return 'any_hash'
    }

    compare (): boolean {
      return true
    }
  }
  return new EncrypterHelperSpy()
}

const makeTokenGeneratorSpy = (): ITokenGenerator => {
  class TokenGeneratorSpy {
    async generate (payload: any): Promise<any> {
      return 'valid_token'
    }
  }
  const tokenGeneratorSpy = new TokenGeneratorSpy()
  return tokenGeneratorSpy
}

type SutTypes = {
  sut: LoginService
  findUserByEmailRepositorySpy: IFindUserByEmailRepository
  encrypterHelperSpy: Encrypter
  tokenGeneratorSpy: ITokenGenerator
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepositorySpy = makeFindUserByEmailRepoSpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()

  const sut = new LoginService(findUserByEmailRepositorySpy, encrypterHelperSpy, tokenGeneratorSpy)

  return {
    sut,
    findUserByEmailRepositorySpy,
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
    const { sut, findUserByEmailRepositorySpy } = makeSut()

    const findUserByEmailRepoSpyCalledWith = jest.spyOn(findUserByEmailRepositorySpy, 'findByEmail')

    await sut.execute('any_email@mail.com', 'any_password')

    expect(findUserByEmailRepoSpyCalledWith).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return null if UserRepository do not found user', async () => {
    const { sut, findUserByEmailRepositorySpy } = makeSut()
    jest.spyOn(findUserByEmailRepositorySpy, 'findByEmail').mockReturnValueOnce(null)

    const token = await sut.execute('any_email@mail.com', 'any_password')

    expect(token).toBeNull()
  })

  test('Should calls EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const hashCalledWith = jest.spyOn(encrypterHelperSpy, 'compare')
    await sut.execute('any_email@mail.com', 'any_password')

    expect(hashCalledWith).toHaveBeenCalledWith('any_password', 'any_hash')
  })

  test('Should return null if EncrypterHelper returns null', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    jest.spyOn(encrypterHelperSpy, 'compare').mockReturnValueOnce(null)

    const token = await sut.execute('invalid_email@mail.com', 'invalid_password')

    expect(token).toBeNull()
  })

  test('Should return token if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const token = await sut.execute('valid_email@mail.com', 'valid_password')

    expect(token).toBe('valid_token')
  })
})
