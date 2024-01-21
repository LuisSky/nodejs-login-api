import { IUserAuthenticate } from '../../../domain/usecases/auth/user-authenticate'
import { MissingParamError } from '../../../utils/errors'
import { HttpHelper } from '../../../utils/helpers'
import { IHttpRequest, IController, IHttpResponse } from '../../../utils/protocols'

export class SigninController implements IController {
  constructor (
    private readonly userAuthenticate: IUserAuthenticate
  ) {}

  async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
    try {
      if (!httpRequest.body) return HttpHelper.badRequest(new MissingParamError('body'))

      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) return HttpHelper.badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      const token = await this.userAuthenticate.auth({ email, password })

      if (!token) return HttpHelper.unauthorized()

      return HttpHelper.validResponse(token)
    } catch (error) {
      return HttpHelper.serverError(error as Error)
    }
  }
}
