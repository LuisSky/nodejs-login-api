const { MissingParamError, ServerError, UnauthorizedError } = require('../../../utils/errors')
const SigninRoute = require('./signin-router')

const makeAuthUseCaseSpy = () => {
  class LoginServiceSpy {
    async verifyLogin (email, password) {
      this.email = email
      this.password = password
      return this.validCredentials
    }
  }
  const loginService = new LoginServiceSpy()
  loginService.validCredentials = true
  return loginService
}

const makeAuthUseCaseSpyWithError = () => {
  class LoginServiceSpyWithError {
    async verifyLogin (email, password) {
      throw new ServerError()
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
    const httpRequest = {}
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
    expect(httpResponse.body).toEqual(new ServerError())
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
