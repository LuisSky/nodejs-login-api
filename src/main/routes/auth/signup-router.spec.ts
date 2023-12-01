import { IRegisterUserService } from '../../../services/auth/interfaces'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import SignupRoute from './signup-router'

const makeRegUserServiceSpy = () => {
  class RegisterUserServiceSpy implements IRegisterUserService {
    email = ''
    password = ''
    isValidEmail = true
    async execute ({ email, password }: Record<string, string> = {}) {
      this.email = email
      this.password = password
    }
  }
  const regUserServiceSpy = new RegisterUserServiceSpy()
  return regUserServiceSpy
}

const makeRegUserServiceSpyWithError = () => {
  class RegisterUserServiceSpyWithError implements IRegisterUserService {
    async execute ({ email, password }: Record<string, string> = {}) {
      throw new Error()
    }
  }
  return new RegisterUserServiceSpyWithError()
}

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy {
    email = ''
    isValidEmail = true
    isValid (email: string) {
      this.email = email
      return this.isValidEmail
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  return emailValidatorSpy
}

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidatorSpy()
  const registerUserServiceSpy = makeRegUserServiceSpy()

  const sut = new SignupRoute(registerUserServiceSpy, emailValidatorSpy)

  return {
    sut,
    registerUserServiceSpy,
    emailValidatorSpy
  }
}

describe('SignupRouter', () => {
  test('Should return 400 if no body is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = { body: '' }
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

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    emailValidatorSpy.isValidEmail = false

    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }

    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ValidationError('email'))
  })

  test('Should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }

    await sut.route(httpRequest)

    expect(emailValidatorSpy.email).toBe(httpRequest.body.email)
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
    const { sut, registerUserServiceSpy } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    await sut.route(httpRequest)
    expect(registerUserServiceSpy.email).toBe(httpRequest.body.email)
    expect(registerUserServiceSpy.password).toBe(httpRequest.body.password)
  })

  test('Should return 500 if RegisterUserService throws', async () => {
    const regUserServiceWithError = makeRegUserServiceSpyWithError()
    const emailValidatorSpy = makeEmailValidatorSpy()
    const sut = new SignupRoute( regUserServiceWithError, emailValidatorSpy
    )

    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error())
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
