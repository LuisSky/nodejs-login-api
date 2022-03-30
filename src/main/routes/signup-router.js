
const HttpResponse = require('../../utils/helpers/http-response')
const { MissingParamError } = require('../../utils/errors')

class SignupRoute {
  constructor (registerUserService) {
    this.registerUserService = registerUserService
  }

  async route (httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))
      if (!httpRequest.body.password) return HttpResponse.badRequest(new MissingParamError('password'))

      const { email, password } = httpRequest.body

      const user = await this.registerUserService.execute(email, password)

      return {
        statusCode: 201,
        body: {
          ...user
        }
      }
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
        err.message = 'internal error'
        err.error = 'internal error'
      }
      return {
        statusCode: err.statusCode,
        body: {
          type: err.message,
          error: err.error
        }
      }
    }
  }
}

module.exports = SignupRoute
