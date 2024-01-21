import { MissingParamError } from '../../utils/errors'
import { IEncrypter, ITokenGenerator } from '../../utils/protocols'
import { DbUserAuthenticate } from './db-user-authenticate'
import { IUserAuthenticate } from '../../domain/usecases/auth/user-authenticate'
import { ILoadUserByEmailRepository } from '../protocols/load-user-by-email-repository'
import { User } from '../../domain/entities/user'

const mockLoadUserByEmailRepository = (): ILoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements ILoadUserByEmailRepository {
    async findByEmail (email: string): Promise<User | null> {
      return { email, password: 'any_hash' }
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

const makeEncrypterHelperSpy = (): IEncrypter => {
  class EncrypterHelperSpy implements IEncrypter {
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
  return new TokenGeneratorSpy()
}

type SutTypes = {
  sut: IUserAuthenticate
  loadUserByEmailRepositoryStub: ILoadUserByEmailRepository
  encrypterHelperSpy: IEncrypter
  tokenGeneratorSpy: ITokenGenerator
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const tokenGeneratorSpy = makeTokenGeneratorSpy()

  const sut = new DbUserAuthenticate(loadUserByEmailRepositoryStub, encrypterHelperSpy, tokenGeneratorSpy)

  return {
    sut,
    loadUserByEmailRepositoryStub,
    encrypterHelperSpy,
    tokenGeneratorSpy
  }
}

const mockCredentials = {
  email: 'any_email',
  password: 'any_password'
}

describe('DbUserAuthenticate', () => {
  test('Should throw if no email is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth({ email: '', password: 'any_password' })
    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no password is provided', async () => {
    const { sut } = makeSut()
    const promise = sut.auth({ email: 'any_email', password: '' })
    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should calls LoadUserByEmailRepository with correct params', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    const loadUserCalledWith = jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail')

    await sut.auth(mockCredentials)

    expect(loadUserCalledWith).toHaveBeenCalledWith('any_email')
  })

  test('Should return null if LoadUserByEmailRepository do not found user', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()
    jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail').mockImplementationOnce(async () => null)

    const token = await sut.auth({ email: 'any_email', password: 'any_password' })

    expect(token).toBeNull()
  })

  test('Should calls EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const hashCalledWith = jest.spyOn(encrypterHelperSpy, 'compare')
    await sut.auth(mockCredentials)

    expect(hashCalledWith).toHaveBeenCalledWith('any_password', 'any_hash')
  })

  test('Should return null if EncrypterHelper returns null', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    jest.spyOn(encrypterHelperSpy, 'compare').mockReturnValueOnce(null)

    const token = await sut.auth(mockCredentials)

    expect(token).toBeNull()
  })

  test('Should return token if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const token = await sut.auth(mockCredentials)

    expect(token).toBe('valid_token')
  })
})
