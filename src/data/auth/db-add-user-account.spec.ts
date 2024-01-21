import { MissingParamError, ValidationError } from '../../utils/errors'
import { IEncrypter } from '../../utils/protocols'
import { DbAddUserAccount } from './db-add-user-account'
import { IAddUserAccount } from '../../domain/usecases/auth/add-user-account'
import { ICreateUserRepository } from '../protocols/create-user-repository'
import { ILoadUserByEmailRepository } from '../protocols/load-user-by-email-repository'
import { User } from '../../domain/entities/user'

const mockLoadUserByEmailRepository = (): ILoadUserByEmailRepository => {
  class LoadUserByEmailRepositoryStub implements ILoadUserByEmailRepository {
    async findByEmail (email: string): Promise<User | null> {
      return null
    }
  }
  return new LoadUserByEmailRepositoryStub()
}

const mockCreateUserRepositorySpy = (): ICreateUserRepository => {
  class CreateUserRepositorySpy implements ICreateUserRepository {
    createOne (user: any): any {
      return { ...user }
    }
  }
  const createUserRepoSpy = new CreateUserRepositorySpy()
  return createUserRepoSpy
}

const mockEncrypterHelperSpy = (): IEncrypter => {
  class EncrypterHelperSpy implements IEncrypter {
    hash (string: string): string {
      return 'valid_hash'
    }

    async compare (str: string, hashString: string): Promise<boolean> {
      return await new Promise<boolean>((resolve) => {
        resolve(true)
      })
    }
  }

  const encrypterHelperSpy = new EncrypterHelperSpy()
  return encrypterHelperSpy
}

type SutTypes = {
  loadUserByEmailRepositoryStub: ILoadUserByEmailRepository
  createUserRepoSpy: ICreateUserRepository
  encrypterHelperSpy: IEncrypter
  sut: IAddUserAccount
}

const makeSut = (): SutTypes => {
  const loadUserByEmailRepositoryStub = mockLoadUserByEmailRepository()
  const createUserRepoSpy = mockCreateUserRepositorySpy()
  const encrypterHelperSpy = mockEncrypterHelperSpy()
  const sut = new DbAddUserAccount(loadUserByEmailRepositoryStub, createUserRepoSpy, encrypterHelperSpy)

  return {
    loadUserByEmailRepositoryStub,
    createUserRepoSpy,
    encrypterHelperSpy,
    sut
  }
}

const mockValidUser = {
  email: 'any_email',
  password: 'any_password'
}

describe('DbAddUserAccount', () => {
  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const mockInvalidUser = {
      email: '',
      password: 'any_password'
    }
    const promise = sut.add(mockInvalidUser)

    await expect(promise).rejects.toThrow(new MissingParamError('email'))
  })

  test('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const mockInvalidUser = {
      email: 'any_email@mail.com',
      password: ''
    }
    const promise = sut.add(mockInvalidUser)

    await expect(promise).rejects.toThrow(new MissingParamError('password'))
  })

  test('Should throw if User alread exists', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail').mockResolvedValueOnce(mockValidUser)

    const promise = sut.add(mockValidUser)

    await expect(promise).rejects.toThrow(new ValidationError('this user alread exist'))
  })

  test('Should call EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const calledWith = jest.spyOn(encrypterHelperSpy, 'hash')

    await sut.add(mockValidUser)

    expect(calledWith).toHaveBeenCalledWith('any_password')
  })

  test('Should call LoadUserByEmailRepository .findByEmail with correct params', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    const findByEmailcalledWith = jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail')

    await sut.add(mockValidUser)

    expect(findByEmailcalledWith).toHaveBeenCalledWith(mockValidUser.email)
  })

  test('Should return an user if valid email and password is provided', async () => {
    const { sut } = makeSut()

    const user = await sut.add(mockValidUser)

    expect(user.email).toBe(mockValidUser.email)
    expect(user.password).toBe('valid_hash')
  })
})
