import ILoginService from "../../../domain/services/protocols/login-service"
import { MissingParamError, UnauthorizedError, ValidationError } from "../../../utils/errors"
import HttpResponse from "../../../utils/helpers/http-response"
import HttpRequest from "../../../utils/helpers/http-request"

export class SigninController {
  constructor (
    private readonly loginService: ILoginService
  ) {}

  async handle (httpRequest: HttpRequest<any>) {
    try {
    
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body'))
      
      const fields = ['email', 'password']
      for(const field of fields) {
        if (!httpRequest.body[field]) return HttpResponse.badRequest(new MissingParamError(field))      
      }
      
      const { email, password } = httpRequest.body

      const token = await this.loginService.verifyLogin(email, password)

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