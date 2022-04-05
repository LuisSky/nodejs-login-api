
const HttpResponse = require('../../../utils/helpers/http-response')
const { MissingParamError, ValidationError } = require('../../../utils/errors')

class SignupRoute {
  constructor ({ registerUserService, emailValidator } = {}) {
    this.registerUserService = registerUserService
    this.emailValidator = emailValidator
  }

  async route (httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))
      if (!httpRequest.body.password) return HttpResponse.badRequest(new MissingParamError('password'))

      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new ValidationError('email'))

      const user = await this.registerUserService.execute({ email, password })

      return HttpResponse.resourceCreated({ ...user })
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpResponse.badRequest(err)
      }
      return HttpResponse.serverError(err)
    }
  }
}

module.exports = SignupRoute
