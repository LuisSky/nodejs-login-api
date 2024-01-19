import { ValidationError } from '../../utils/errors'
import { IEncrypter } from '../../utils/protocols'
import { ICreateUserRepository, IFindUserByEmailRepository } from '../../domain/services/auth/interfaces'
import { DbAddUserAccount } from './db-add-user-account'
import { IAddUserAccount } from '../../domain/auth/add-user-account'

const makeFindUserByEmailRepository = (): IFindUserByEmailRepository => {
  class FindUserByEmailRepositorySpy implements IFindUserByEmailRepository {
    findByEmail (email: string): boolean {
      return false
    }
  }
  const findUserByEmailRepositorySpy = new FindUserByEmailRepositorySpy()
  return findUserByEmailRepositorySpy
}

const makeCreateUserRepositorySpy = (): ICreateUserRepository => {
  class CreateUserRepositorySpy implements ICreateUserRepository {
    createOne (user: any): any {
      return { ...user }
    }
  }
  const createUserRepoSpy = new CreateUserRepositorySpy()
  return createUserRepoSpy
}

const makeEncrypterHelperSpy = (): IEncrypter => {
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
  findUserByEmailRepoSpy: IFindUserByEmailRepository
  createUserRepoSpy: ICreateUserRepository
  encrypterHelperSpy: IEncrypter
  sut: IAddUserAccount
}

const makeSut = (): SutTypes => {
  const findUserByEmailRepoSpy = makeFindUserByEmailRepository()
  const createUserRepoSpy = makeCreateUserRepositorySpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const sut = new DbAddUserAccount(findUserByEmailRepoSpy, createUserRepoSpy, encrypterHelperSpy)

  return {
    findUserByEmailRepoSpy,
    createUserRepoSpy,
    encrypterHelperSpy,
    sut
  }
}

describe('UserService', () => {
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
    const { sut, findUserByEmailRepoSpy } = makeSut()

    jest.spyOn(findUserByEmailRepoSpy, 'findByEmail').mockImplementationOnce(() => {
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

  test('Should call FindUserByEmailRepository .findByEmail with correct params', async () => {
    const { sut, findUserByEmailRepoSpy } = makeSut()

    const findByEmailcalledWith = jest.spyOn(findUserByEmailRepoSpy, 'findByEmail')
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
