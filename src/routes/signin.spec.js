const { MissingParamError } = require('../helpers/errors')
const SigninRoute = require('./signin')

const makeSut = () => {
  const signinRoute = new SigninRoute()
  return signinRoute
}

describe('SigninRouter', () => {
  test('Should return 400 if no email is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      password: 'any_pass'
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })

  test('Should return 400 if no password is provided', async () => {
    const sut = makeSut()
    const httpRequest = {
      email: 'any_mail@mail.com'
    }
    const httpResponse = await sut.route(httpRequest)

    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
