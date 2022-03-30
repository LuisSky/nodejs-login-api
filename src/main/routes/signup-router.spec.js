const { MissingParamError, ServerError } = require('../../utils/errors')
const SignupRoute = require('./signup-router')

const makeRegUserServiceSpy = () => {
  class RegisterUserServiceSpy {
    async execute (email, password) {
      this.email = email
      this.password = password
    }
  }
  return new RegisterUserServiceSpy()
}

const makeRegUserServiceSpyWithError = () => {
  class RegisterUserServiceSpyWithError {
    async execute (email, password) {
      throw new Error()
    }
  }
  return new RegisterUserServiceSpyWithError()
}

const makeSut = () => {
  const registerUserService = makeRegUserServiceSpy()
  const sut = new SignupRoute(registerUserService)

  return {
    sut,
    registerUserService
  }
}

describe('SignupRouter', () => {
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
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should call RegisterUserService with correct params', async () => {
    const { sut, registerUserService } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    await sut.route(httpRequest)
    expect(registerUserService.email).toBe(httpRequest.body.email)
    expect(registerUserService.password).toBe(httpRequest.body.password)
  })

  test('Should return 500 if RegisterUserService throws', async () => {
    const regUserServiceWithError = makeRegUserServiceSpyWithError()
    const sut = new SignupRoute(regUserServiceWithError)

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new ServerError())
  })

  test('Should return 201 if valid informations are provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
