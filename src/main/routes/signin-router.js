
const { MissingParamError } = require('../../utils/errors')
const HttpResponse = require('../../utils/helpers/http-response')

class SigninRoute {
  constructor (loginService) {
    this.loginService = loginService
  }

  async route (httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))
      if (!httpRequest.body.password) return HttpResponse.badRequest(new MissingParamError('password'))

      const { email, password } = httpRequest.body

      const token = await this.loginService.verifyLogin(email, password)

      if (!token) return HttpResponse.unauthorized()

      return HttpResponse.validResponse(token)
    } catch {
      return HttpResponse.serverError()
    }
  }
}

module.exports = SigninRoute
