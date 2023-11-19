import validator from 'validator'
import { MissingParamError } from '../errors'

export default class EmailValidator {
  isValid (email: string) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return validator.isEmail(email)
  }
}