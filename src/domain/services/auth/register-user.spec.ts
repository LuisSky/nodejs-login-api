import RegisterUserService from './register-user'
import { ValidationError } from '../../../utils/errors'
import EncryptHelper from '../../../utils/helpers/encrypter'
import { IUserRepository } from './interfaces'


const makeUserRepositorySpy = () => {
  class UserRepositorySpy implements IUserRepository {
    mockExistUser=false
    email = ''
    password = ''
    async findByEmail (email: string) {
      return this.mockExistUser
    }

    async createOne ({ email, password }: Record<string, string> = {}) {
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
  class EncrypterHelperSpy implements EncryptHelper {
    string = ''
    hashString = ''
    hash (string: string) {
      this.string = string
      this.hashString = 'hash_string'
      return this.hashString
    }
    compare(str: string, hashString: string): Promise<boolean> {
      return new Promise<boolean>((resolve, reject) => {
        true
      }) 
    }
  }

  const encrypterHelperSpy = new EncrypterHelperSpy()
  return encrypterHelperSpy
}

const makeSut = () => {
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
  // test('Should throw if no UserRepository is provided', async () => {
  //   const sut = new RegisterUserService( )
  //   const credentials = {
  //     email: 'any_email@email.com',
  //     password: 'any_password'
  //   }
  //   const promise = sut.execute(credentials)

  //   expect(promise).rejects.toThrowError(new MissingParamError('UserRepository'))
  // })

  // test('Should throw if no EncrypterHelper is provided', async () => {
  //   const sut = new RegisterUserService({ userRepository: makeUserRepositorySpy() })

  //   const credentials = {
  //     email: 'any_email@email.com',
  //     password: 'any_password'
  //   }
  //   const promise = sut.execute(credentials)

  //   expect(promise).rejects.toThrowError(new MissingParamError('EncrypterHelper'))
  // })

  test('Should throw if no Email is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      email: '',
      password: 'any_password'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrow(new ValidationError('email'))
  })

  test('Should throw if no Password is provided', async () => {
    const { sut } = makeSut()
    const credentials = {
      email: 'any_email@mail.com',
      password: ''
    }
    const promise = sut.execute(credentials)
  
    expect(promise).rejects.toThrow(new ValidationError('password'))
  })

  test('Should throw if no User alread exists', async () => {
    const { sut, userRepoSpy } = makeSut()
    userRepoSpy.mockExistUser = true

    const credentials = {
      email: 'any_email@mail.com',
      password: 'any_pass'
    }
    const promise = sut.execute(credentials)

    expect(promise).rejects.toThrow(new ValidationError('this user alread exist'))
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
