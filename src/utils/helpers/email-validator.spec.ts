
import EmailValidator from './email-validator'
import { MissingParamError } from '../errors'

const makeSut = () => {
  const sut = new EmailValidator()
  return sut
}

describe('EmailValidator', () => {
 
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
