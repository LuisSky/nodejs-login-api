
const { MissingParamError, ServerError } = require('../helpers/errors')
const HttpResponse = require('./helpers/http-response')

class SigninRoute {
  constructor (authUseCase) {
    this.authUseCase = authUseCase
  }

  async route (httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))
      if (!httpRequest.body.password) return HttpResponse.badRequest(new MissingParamError('password'))

      const { email, password } = httpRequest.body

      const token = await this.authUseCase.verifyLogin(email, password)

      return HttpResponse.validResponse(token)
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500
        err.message = 'internal error'
        err.error = 'internal error'
      }
      return HttpResponse.serverError(new ServerError(err.message))
    }
  }
}

module.exports = SigninRoute
