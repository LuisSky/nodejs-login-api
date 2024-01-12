import { AddUserAccount } from '../../../domain/auth/add-user-account'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import { EmailValidator, HttpResponse } from '../../../utils/helpers'
import { Service, HttpRequest, Controller, HttpResponse as httpRes } from '../../../utils/protocols'

export class SignupController implements Controller {
  constructor (
    private readonly addUserAccount: AddUserAccount,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<httpRes> {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))

      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) return HttpResponse.badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email as string)) return HttpResponse.badRequest(new ValidationError('email'))

      const user = await this.addUserAccount.add({ email, password })

      return HttpResponse.resourceCreated({ ...user })
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpResponse.badRequest(err)
      }
      return HttpResponse.serverError(err as Error)
    }
  }
}
