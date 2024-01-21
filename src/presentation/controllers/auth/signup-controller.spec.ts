import { MissingParamError, ValidationError } from '../../../utils/errors'
import { SignupController } from './signup-controller'
import { IAddUserAccount, IAddUserAccountParams } from '../../../domain/usecases/auth/add-user-account'
import { User } from '../../../domain/entities/user'
import { IEmailValidator } from '../../../utils/protocols/email-validator'

const mockNewUser: User = {
  id: 'any_id',
  email: 'any_email@mail.com',
  password: 'any_hash_pass'
}

const mockAddUserAccountStub = (): IAddUserAccount => {
  class AddUserAccountStub implements IAddUserAccount {
    async add (user: IAddUserAccountParams): Promise<User> {
      return await Promise.resolve(mockNewUser)
    }
  }
  return new AddUserAccountStub()
}

const makeEmailValidatorSpy = (): IEmailValidator => {
  class EmailValidatorSpy implements IEmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  const emailValidatorSpy = new EmailValidatorSpy()
  return emailValidatorSpy
}

const makeSut = () => {
  const emailValidatorSpy = makeEmailValidatorSpy()
  const addUserAccountStub = mockAddUserAccountStub()

  const sut = new SignupController(addUserAccountStub, emailValidatorSpy)

  return {
    sut,
    addUserAccountStub,
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

    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => false)

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

    const isValid = jest.spyOn(emailValidatorSpy, 'isValid')

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
    const { sut, addUserAccountStub } = makeSut()

    const execute = jest.spyOn(addUserAccountStub, 'add')

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
    const { sut, addUserAccountStub } = makeSut()

    jest.spyOn(addUserAccountStub, 'add').mockRejectedValue(new Error())

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

    jest.spyOn(emailValidatorSpy, 'isValid').mockImplementationOnce(() => {
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
