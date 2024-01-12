import { MissingParamError, ValidationError } from '../../../utils/errors'
import { HttpResponse } from '../../../utils/helpers'
import { Service, HttpRequest, Controller, HttpResponse as httpResp } from '../../../utils/protocols'

export class SigninController implements Controller {
  constructor (
    private readonly loginService: Service
  ) {}

  async handle (httpRequest: HttpRequest): Promise<httpResp> {
    try {
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))

      const fields = ['email', 'password']
      for (const field of fields) {
        if (!httpRequest.body[field]) return HttpResponse.badRequest(new MissingParamError(field))
      }

      const { email, password } = httpRequest.body

      const token = await this.loginService.execute(email, password)

      if (!token) return HttpResponse.unauthorized()

      return HttpResponse.validResponse(token)
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpResponse.badRequest(err)
      }
      return HttpResponse.serverError(err as Error)
    }
  }
}
