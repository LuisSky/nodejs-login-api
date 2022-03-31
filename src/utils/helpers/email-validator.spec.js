const validator = require('validator')
const { MissingParamError } = require('../errors')

class EmailValidator {
  isValid (email) {
    if (!email) {
      throw new MissingParamError('email')
    }
    return validator.isEmail(email)
  }
}

const makeSut = () => {
  const sut = new EmailValidator()
  return sut
}

describe('EmailValidator', () => {
  test('Should throw if no email is provided', () => {
    const sut = makeSut()

    expect(() => {
      sut.isValid()
    }).toThrow(new MissingParamError('email'))
  })
})
