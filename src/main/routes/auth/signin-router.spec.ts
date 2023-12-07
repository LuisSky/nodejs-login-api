import { ILoginService, IUserRepository, User } from '../../../domain/services/auth/interfaces'
import LoginService from '../../../domain/services/auth/login-service'
import { MissingParamError, ServerError, UnauthorizedError } from '../../../utils/errors'
import SigninRoute from './signin-router'



const makeAuthUseCaseSpy = () => {
  const userRepositorySpy = makeUserRepositorySpy()
  class LoginServiceSpy implements ILoginService {
  
    email = ''
    password = ''
    validCredentials = true
    
    async verifyLogin (email: string, password: string) {
      this.email = email
      this.password = password
      return this.validCredentials
    }
  }
  const loginService = new LoginServiceSpy()
  return loginService
}


const makeUserRepositorySpy = () => {
  class UserRepositorySpy implements IUserRepository {
    createOne(user: User) {
    }
    findByEmail(email: string){
    }
  }
  const userRepositorySpy = new UserRepositorySpy()
  return userRepositorySpy

}

const makeAuthUseCaseSpyWithError = () => {
  class LoginServiceSpyWithError implements ILoginService {
    async verifyLogin (email: string, password: string) {
      throw new ServerError('')
    }
  }
  return new LoginServiceSpyWithError()
}

const makeSut = () => {
  const loginService = makeAuthUseCaseSpy()
  const sut = new SigninRoute(loginService)
  return {
    sut,
    loginService
  }
}

describe('SigninRouter', () => {
  test('Should return 400 if no body is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: ''
    }
    const httpResponse = await sut.route(httpRequest)

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
    const httpResponse = await sut.route(httpRequest)

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
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should calls AuthUseCase with correct params', async () => {
    const { sut, loginService } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    await sut.route(httpRequest)

    expect(loginService.email).toBe(httpRequest.body.email)
    expect(loginService.password).toBe(httpRequest.body.password)
  })

  test('Should returns 500 if AuthUseCase throws', async () => {
    const authUseCaseWithError = makeAuthUseCaseSpyWithError()
    const sut = new SigninRoute(authUseCaseWithError)

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.body).toEqual(new ServerError(''))
    expect(httpResponse.statusCode).toBe(500)
  })

  test('Should return 401 if invalid crendentials are provided', async () => {
    const { sut, loginService } = makeSut()

    loginService.validCredentials = false

    const httpRequest = {
      body: {
        email: 'invalid_mail@mail.com',
        password: 'invalid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(401)
    expect(httpResponse.body).toEqual(new UnauthorizedError('Unauthorized'))
  })

  test('Should return 200 if valid crendentials are provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'valid_mail@mail.com',
        password: 'valid_password'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(200)
  })
})
