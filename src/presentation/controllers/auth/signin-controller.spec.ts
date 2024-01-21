import { MissingParamError, UnauthorizedError } from '../../../utils/errors'
import { SigninController } from './signin-controller'
import { IUserAuthenticate, IUserAuthenticateParams } from '../../../domain/usecases/auth/user-authenticate'

const mockAuthenticateUserStub = (): IUserAuthenticate => {
  class AuthenticateUserStub implements IUserAuthenticate {
    async auth (user: IUserAuthenticateParams): Promise<any> {
      return 'valid_token'
    }
  }
  return new AuthenticateUserStub()
}

type SutTypes = {
  sut: SigninController
  authenticateUserStub: IUserAuthenticate
}

const makeSut = (): SutTypes => {
  const authenticateUserStub = mockAuthenticateUserStub()
  const sut = new SigninController(authenticateUserStub)
  return {
    sut,
    authenticateUserStub
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

  test('Should calls UserAuthenticate with correct params', async () => {
    const { sut, authenticateUserStub } = makeSut()

    const execute = jest.spyOn(authenticateUserStub, 'auth')

    const httpRequest = {
      body: {
        email: 'any_mail@mail.com',
        password: 'any_password'
      }
    }
    await sut.handle(httpRequest)

    const { email, password } = httpRequest.body
    expect(execute).toHaveBeenCalledWith({ email, password })
  })

  test('Should returns 500 if UserAuthenticate throws', async () => {
    const { sut, authenticateUserStub } = makeSut()

    jest.spyOn(authenticateUserStub, 'auth').mockRejectedValueOnce(new Error())

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
    const { sut, authenticateUserStub } = makeSut()

    jest.spyOn(authenticateUserStub, 'auth').mockResolvedValueOnce(false)

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
