import { MissingParamError } from '../errors'

function isValidEmailAdress(email: string) {
  const testEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return testEmailRegex.test(email);
}

export class EmailValidator {
  isValid (email: string) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return isValidEmailAdress(email)
  }
}