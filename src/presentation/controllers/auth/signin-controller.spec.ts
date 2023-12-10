import { IUserRepository, User } from '../../../domain/services/auth/interfaces'
import { Service } from '../../../utils/protocols'
import { MissingParamError, ServerError, UnauthorizedError, ValidationError } from '../../../utils/errors'
import { SigninController } from './signin-controller'



const makeLoginServiceSpy = () => {
  const userRepositorySpy = makeUserRepositorySpy()
  
  class LoginServiceSpy implements Service {  
    async execute (email: string, password: string): Promise<string | boolean> {
      return 'valid_token'
    }
  }  
  const loginService = new LoginServiceSpy()
  return loginService
}

// TODO: make refactor to this function, create a factory to compose LoginService
const makeUserRepositorySpy = () => {
  class UserRepositorySpy implements IUserRepository {
    createOne(user: User) {}
    findByEmail(email: string) {}
  }
  const userRepositorySpy = new UserRepositorySpy()
  return userRepositorySpy

}

const makeSut = () => {
  const loginServiceSpy = makeLoginServiceSpy()
  const sut = new SigninController(loginServiceSpy)
  return {
    sut,
    loginServiceSpy
  }
}

describe('SigninControllerr', () => {
  test('Should return 400 if no body is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: ''
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('body'))
  })

  test('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should calls LoginService with correct params', async () => {
    const { sut, loginServiceSpy } = makeSut()

    const execute = jest.spyOn(loginServiceSpy, "execute")
    
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    
    const { email, password } = httpRequest.body
    expect(execute).toHaveBeenCalledWith(email, password)
  
  })

  test('Should returns 500 if LoginService throws', async () => {
    const { sut, loginServiceSpy } = makeSut()
    
    jest.spyOn(loginServiceSpy, "execute").mockRejectedValueOnce(new Error())
    
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 401 if invalid crendentials are provided', async () => {
    const { sut, loginServiceSpy } = makeSut()

    jest.spyOn(loginServiceSpy, "execute").mockResolvedValueOnce(false)
    
    const httpRequest = {
      body: {
        email: 'invalid_mail@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError())
  })
  
  test('Should return a token if valid crendentials are provided', async () => {
  
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_mail@mail.com',
        password: 'valid_password'
      }
    }
    
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse.body).toBe('valid_token')
  })
})
