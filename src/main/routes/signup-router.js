
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

      return HttpResponse.resourceCreated({ ...user })
    } catch (err) {
      return HttpResponse.serverError(err)
    }
  }
}

module.exports = SignupRoute
