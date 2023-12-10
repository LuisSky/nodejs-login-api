import { Service } from '../../../utils/protocols'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import EmailValidator from '../../../utils/helpers/email-validator'
import { SignupController } from './signup-controller'

const makeRegUserServiceSpy = () => {
  class RegisterUserServiceSpy implements Service {
    async execute ({ email, password }: Record<string, string>): Promise<any> {
      return new Promise(resolve => resolve(''))
    }
  }
  const regUserServiceSpy = new RegisterUserServiceSpy()
  
  return regUserServiceSpy
}

const makeEmailValidatorSpy = () => {
  class EmailValidatorSpy implements EmailValidator {
    isValid (email: string) {
      return true
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  return emailValidatorSpy
}

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidatorSpy()
  const registerUserServiceSpy = makeRegUserServiceSpy()

  const sut = new SignupController(registerUserServiceSpy, emailValidatorSpy)

  return {
    sut,
    registerUserServiceSpy,
    emailValidatorSpy
  }
}

describe('SignupController', () => {
  test('Should return 400 if no body is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = { body: '' }
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

  test('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatorSpy } = makeSut()

    jest.spyOn(emailValidatorSpy, "isValid").mockImplementationOnce(() => false)
    
    const httpRequest = {
      body: {
        email: 'invalid_email',
        password: 'any_password'
      }
    }
    
    const httpResponse = await sut.handle(httpRequest)
    
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new ValidationError('email'))
  })

  test('Should call EmailValidator with correct param', async () => {
    const { sut, emailValidatorSpy } = makeSut()
  
    const isValid = jest.spyOn(emailValidatorSpy, "isValid")
    
    const httpRequest = {
      body: {
        email: 'any_email',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    
    expect(isValid).toHaveBeenCalledWith(httpRequest.body.email)
  })

  test('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut()

    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('password'))
  })

  test('Should call RegisterUserService with correct params', async () => {
    const { sut, registerUserServiceSpy } = makeSut()

    const execute = jest.spyOn(registerUserServiceSpy, "execute")
    
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    await sut.handle(httpRequest)
    expect(execute).toHaveBeenCalledWith({ ...httpRequest.body })
  })

  test('Should return 500 if RegisterUserService throws', async () => {
    const { sut, registerUserServiceSpy } = makeSut()
    
    jest.spyOn(registerUserServiceSpy, "execute").mockRejectedValue(new Error())
    
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse.body).toEqual(new Error())
  })
  
  test('Should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidatorSpy } = makeSut()
    
    jest.spyOn(emailValidatorSpy, "isValid").mockImplementationOnce(() => {
      throw new Error()
    })
    
    const httpRequest = {
      body: {
        email: 'any_email@mail.com',
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.handle(httpRequest)

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
    const httpResponse = await sut.handle(httpRequest)

    expect(httpResponse.statusCode).toBe(201)
  })
})
