
import { httpRequest } from '../../../domain/services/auth/interfaces'
import ILoginService from '../../../domain/services/protocols/login-service'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import HttpResponse from '../../../utils/helpers/http-response'

export default class SigninRoute {
  constructor (
    private readonly loginService: ILoginService
  ) {}

  async route (httpRequest: httpRequest) {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      if (!httpRequest.body.email) return HttpResponse.badRequest(new MissingParamError('email'))
      if (!httpRequest.body.password) return HttpResponse.badRequest(new MissingParamError('password'))

      const { email, password } = httpRequest.body

      const token = await this.loginService.verifyLogin(email, password)

      if (!token) return HttpResponse.unauthorized()

      return HttpResponse.validResponse(token)
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpResponse.badRequest(err)
      }
      return HttpResponse.serverError(err)
    }
  }
}