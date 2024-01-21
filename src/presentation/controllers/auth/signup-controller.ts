import { IAddUserAccount } from '../../../domain/usecases/auth/add-user-account'
import { MissingParamError, ValidationError } from '../../../utils/errors'
import { HttpHelper } from '../../../utils/helpers'
import { IHttpRequest, IController, IHttpResponse } from '../../../utils/protocols'
import { IEmailValidator } from '../../../utils/protocols/email-validator'

export class SignupController implements IController {
  constructor (
    private readonly addUserAccount: IAddUserAccount,
    private readonly emailValidator: IEmailValidator
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
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
    } catch (error) {
      return HttpHelper.serverError(error as Error)
    }
  }
}
