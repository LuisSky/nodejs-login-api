import { Service } from "../../../utils/protocols"
import { MissingParamError, ValidationError } from "../../../utils/errors"
import EmailValidator from "../../../utils/helpers/email-validator"
import HttpResponse from "../../../utils/helpers/http-response"
import { HttpRequest } from "../../../utils/protocols"
import { Controller } from "../../../utils/protocols"


export class SignupController implements Controller {
  constructor (
    private readonly registerUserService: Service,
    private readonly emailValidator: EmailValidator
  ) {}

  async handle (httpRequest: HttpRequest<any>) {
    try {
    
      if (!httpRequest.body) return HttpResponse.badRequest(new MissingParamError('body')) 
      
      const fields = ['email', 'password']
      for(const field of fields) {
        if (!httpRequest.body[field]) return HttpResponse.badRequest(new MissingParamError(field))      
      }
      
      const { email, password } = httpRequest.body

      if (!this.emailValidator.isValid(email)) return HttpResponse.badRequest(new ValidationError('email'))

      const user = await this.registerUserService.execute({ email, password })

      return HttpResponse.resourceCreated({ ...user })
    } catch (err) {
      if (err instanceof ValidationError || err instanceof MissingParamError) {
        return HttpResponse.badRequest(err)
      }
      return HttpResponse.serverError(err as Error)
    }
  }
}

