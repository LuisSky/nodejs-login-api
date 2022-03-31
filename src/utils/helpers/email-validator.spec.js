jest.mock('validator', () => {
  return {
    isEmail (email) {
      this.email = email
      return this.isValidEmail
    }
  }
})

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
  beforeEach(() => {
    validator.isValidEmail = undefined
  })
  test('Should throw if no email is provided', () => {
    const sut = makeSut()

    expect(() => {
      sut.isValid()
    }).toThrow(new MissingParamError('email'))
  })

  test('Should return false if invalid email is provided', () => {
    const sut = makeSut()

    validator.isValidEmail = false
    const isValidEmail = sut.isValid('invalidEmail')

    expect(isValidEmail).toBe(false)
  })

  test('Should return true if valid email is provided', () => {
    const sut = makeSut()

    validator.isValidEmail = true
    const isValidEmail = sut.isValid('validEmail@mail.com')

    expect(isValidEmail).toBe(true)
  })
})
