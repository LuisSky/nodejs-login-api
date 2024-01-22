import { IEmailValidator } from '../../utils/protocols/email-validator'
import { MissingParamError } from '../../utils/errors'

function isValidEmailAdress (email: string) {
  const testEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return testEmailRegex.test(email)
}

export class RegExpEmailValidator implements IEmailValidator {
  isValid (email: string) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return isValidEmailAdress(email)
  }
}
