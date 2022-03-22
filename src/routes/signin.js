
const { MissingParamError } = require('../helpers/errors')
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

      if (!token) return HttpResponse.unauthorized()

      return HttpResponse.validResponse(token)
    } catch {
      return HttpResponse.serverError()
    }
  }
}

module.exports = SigninRoute
