import { AddUserAccount } from '../../../domain/auth/add-user-account'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import { EmailValidator, HttpHelper } from '../../../utils/helpers'
import { HttpRequest, Controller, HttpResponse } from '../../../utils/protocols'

export class SignupController implements Controller {
  constructor (
    private readonly addUserAccount: AddUserAccount,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body) return HttpHelper.badRequest(new MissingParamError('body'))

      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) return HttpHelper.badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email as string)) return HttpHelper.badRequest(new ValidationError('email'))

      const user = await this.addUserAccount.add({ email, password })

      return HttpHelper.resourceCreated({ ...user })
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpHelper.badRequest(err)
      }
      return HttpHelper.serverError(err as Error)
    }
  }
}
