import RegisterUserService from './register-user'
import { ValidationError } from '../../../utils/errors'
import { Encrypter } from '../../../utils/protocols'
import { IUserRepository } from './interfaces'

const makeUserRepositorySpy = (): IUserRepository => {
  class UserRepositorySpy implements IUserRepository {
    findByEmail (email: string): boolean {
      return false
    }

    createOne (user: any): any {
      return { ...user }
    }
  }
  const userRepositorySpy = new UserRepositorySpy()
  return userRepositorySpy
}

const makeEncrypterHelperSpy = (): Encrypter => {
  class EncrypterHelperSpy implements Encrypter {
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

const makeSut = (): any => {
  const userRepoSpy = makeUserRepositorySpy()
  const encrypterHelperSpy = makeEncrypterHelperSpy()
  const sut = new RegisterUserService(userRepoSpy, encrypterHelperSpy)

  return {
    userRepoSpy,
    encrypterHelperSpy,
    sut
  }
}

describe('UserService', () => {
  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      email: '',
      password: 'any_password'
    }
    const promise = sut.execute(credentials)

    await expect(promise).rejects.toThrow(new ValidationError('email'))
  })

  test('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      email: 'any_email@mail.com',
      password: ''
    }
    const promise = sut.execute(credentials)

    await expect(promise).rejects.toThrow(new ValidationError('password'))
  })

  test('Should throw if User alread exists', async () => {
    const { sut, userRepoSpy } = makeSut()

    jest.spyOn(userRepoSpy, 'findByEmail').mockImplementationOnce(() => {
      throw new ValidationError('this user alread exist')
    })

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    const promise = sut.execute(credentials)

    await expect(promise).rejects.toThrow(new ValidationError('this user alread exist'))
  })

  test('Should call EncrypterHelper with correct params', async () => {
    const { sut, encrypterHelperSpy } = makeSut()

    const calledWith = jest.spyOn(encrypterHelperSpy, 'hash')
    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    await sut.execute(credentials)

    expect(calledWith).toHaveBeenCalledWith('any_pass')
  })

  test('Should call UserRepository .findByEmail .createOne with correct params', async () => {
    const { sut, userRepoSpy } = makeSut()

    const findByEmailcalledWith = jest.spyOn(userRepoSpy, 'findByEmail')
    // const createOnecalledWith = jest.spyOn(userRepoSpy, 'createOne')

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }

    await sut.execute(credentials)

    expect(findByEmailcalledWith).toHaveBeenCalledWith(credentials.email)
    // TODO: when added the model, re-create the following test ( because that receive an object )
    // expect(createOnecalledWith).toHaveBeenCalledWith(credentials.password)
  })

  test('Should returns an user if valid email and password is provided', async () => {
    const { sut } = makeSut()

    const credentials = {
      email: 'valid_email@mail.com',
      password: 'valid_pass'
    }
    const user = await sut.execute(credentials)

    expect(user.email).toBe(credentials.email)
    expect(user.password).toBe('valid_hash')
  })
})
