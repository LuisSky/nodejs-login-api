import { MissingParamError, ValidationError } from '../../../utils/errors'
import { HttpHelper } from '../../../utils/helpers'
import { Service, HttpRequest, Controller, HttpResponse } from '../../../utils/protocols'

export class SigninController implements Controller {
  constructor (
    private readonly loginService: Service
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body) return HttpHelper.badRequest(new MissingParamError('body'))

      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) return HttpHelper.badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      const token = await this.loginService.execute(email, password)

      if (!token) return HttpHelper.unauthorized()

      return HttpHelper.validResponse(token)
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpHelper.badRequest(err)
      }
      return HttpHelper.serverError(err as Error)
    }
  }
}
