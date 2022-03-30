const { MissingParamError } = require('../../utils/errors')
const SignupRoute = require('./signup-router')

describe('SignupRouter', () => {
  test('Should return 400 if no body is provided', async () => {
    const sut = new SignupRoute()

    const httpRequest = {}
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('body'))
  })

  test('Should return 400 if no email is provided', async () => {
    const sut = new SignupRoute()

    const httpRequest = {
      body: {
        password: 'any_pass'
      }
    }
    const httpResponse = await sut.route(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamError('email'))
  })
})
