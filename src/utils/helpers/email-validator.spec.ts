import { RegExpEmailValidator } from './email-validator'
import { MissingParamError } from '../errors'
import { EmailValidator } from '../../presentation/protocols/email-validator'

const makeSut = (): EmailValidator => {
  const sut = new RegExpEmailValidator()
  return sut
}

describe('RegExpEmailValidator', () => {
  test('Should throw if no email is provided', () => {
    const sut = makeSut()

    expect(() => {
      sut.isValid('')
    }).toThrow(new MissingParamError('email'))
  })

  test('Should return false if invalid email is provided', () => {
    const sut = makeSut()

    const isValidEmail = sut.isValid('invalid')

    expect(isValidEmail).toBe(false)
  })

  test('Should return true if valid email is provided', () => {
    const sut = makeSut()
    const isValidEmail = sut.isValid('validEmail@mail.com')

    expect(isValidEmail).toBe(true)
  })
})
