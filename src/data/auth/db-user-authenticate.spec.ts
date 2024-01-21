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

const mockEncrypterHelperStub = (): IEncrypter => {
  class EncrypterHelperStub implements IEncrypter {
    hash (): string {
      return 'any_hash'
    }

    compare (): boolean {
      return true
    }
  }
  return new EncrypterHelperStub()
}

const mockTokenGeneratorStub = (): ITokenGenerator => {
  class TokenGeneratorStub {
    async generate (payload: any): Promise<any> {
      return 'valid_token'
    }
  }
  return new TokenGeneratorStub()
}

type SutTypes = {
  sut: IUserAuthenticate
  loadUserByEmailRepositoryStub: ILoadUserByEmailRepository
  encrypterHelperStub: IEncrypter
  tokenGeneratorStub: ITokenGenerator
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const encrypterHelperStub = mockEncrypterHelperStub()
  const tokenGeneratorStub = mockTokenGeneratorStub()

  const sut = new DbUserAuthenticate(loadUserByEmailRepositoryStub, encrypterHelperStub, tokenGeneratorStub)

  return {
    sut,
    loadUserByEmailRepositoryStub,
    encrypterHelperStub,
    tokenGeneratorStub
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
    const { sut, encrypterHelperStub } = makeSut()

    const hashCalledWith = jest.spyOn(encrypterHelperStub, 'compare')
    await sut.auth(mockCredentials)

    expect(hashCalledWith).toHaveBeenCalledWith('any_password', 'any_hash')
  })

  test('Should return null if EncrypterHelper returns null', async () => {
    const { sut, encrypterHelperStub } = makeSut()

    jest.spyOn(encrypterHelperStub, 'compare').mockReturnValueOnce(null)

    const token = await sut.auth(mockCredentials)

    expect(token).toBeNull()
  })

  test('Should return token if valid credentials are provided', async () => {
    const { sut } = makeSut()

    const token = await sut.auth(mockCredentials)

    expect(token).toBe('valid_token')
  })
})
