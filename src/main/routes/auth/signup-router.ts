
import HttpResponse from '../../../utils/helpers/http-response'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import RegisterUserService from '../../../services/auth/register-user'
import EmailValidator from '../../../utils/helpers/email-validator'
import { httpRequest } from '../../../services/auth/interfaces'


export default class SignupRoute {
  constructor (
    private readonly registerUserService: RegisterUserService,
    private readonly emailValidator: EmailValidator
  ) {}

  async route (httpRequest: httpRequest) {
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

