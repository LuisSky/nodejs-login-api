import { ValidationError } from '../../utils/errors'
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

describe('DbAddUserAccount', () => {
  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const mockUser = {
      email: '',
      password: 'any_password'
    }
    const promise = sut.add(mockUser)

    await expect(promise).rejects.toThrow(new ValidationError('email'))
  })

  test('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const mockUser = {
      email: 'any_email@mail.com',
      password: ''
    }
    const promise = sut.add(mockUser)

    await expect(promise).rejects.toThrow(new ValidationError('password'))
  })

  test('Should throw if User alread exists', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail').mockImplementationOnce(() => {
      throw new ValidationError('this user alread exist')
    })

    const mockUser = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    const promise = sut.add(mockUser)

    await expect(promise).rejects.toThrow(new ValidationError('this user alread exist'))
  })

  test('Should call EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const calledWith = jest.spyOn(encrypterHelperSpy, 'hash')
    const mockUser = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    await sut.add(mockUser)

    expect(calledWith).toHaveBeenCalledWith('any_pass')
  })

  test('Should call LoadUserByEmailRepository .findByEmail with correct params', async () => {
    const { sut, loadUserByEmailRepositoryStub } = makeSut()

    const findByEmailcalledWith = jest.spyOn(loadUserByEmailRepositoryStub, 'findByEmail')
    // const createOnecalledWith = jest.spyOn(userRepoSpy, 'createOne')

    const mockUser = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }

    await sut.add(mockUser)

    expect(findByEmailcalledWith).toHaveBeenCalledWith(mockUser.email)
    // TODO: when added the model, re-create the following test ( because that receive an object )
    // expect(createOnecalledWith).toHaveBeenCalledWith(credentials.password)
  })

  test('Should returns an user if valid email and password is provided', async () => {
    const { sut } = makeSut()

    const mockUser = {
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
    const user = await sut.add(mockUser)

    expect(user.email).toBe(mockUser.email)
    expect(user.password).toBe('valid_hash')
  })
})
