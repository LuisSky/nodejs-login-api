import { TokenGenerator } from './token-generator'
import jwt from 'jsonwebtoken'

jest.mock('jsonwebtoken', () => ({
  sign (): string {
    return 'any_token'
  },

  verify (): string {
    return 'any_value'
  }
}))

const makeSut = () => {
  const secretTokenCode = 'any_secret_token'

  const sut = new TokenGenerator(secretTokenCode)
  return {
    sut,
    secretTokenCode
  }
}

describe('TokenGenerator', () => {
  test('Should receive Secret-Code on this constructor', () => {
    const secretCode = 'any-toke-code'
    const sut = new TokenGenerator(secretCode)

    expect(sut.tokenSecretCode).toBe(secretCode)
  })

  test('Should call JWT with correct params', async () => {
    const { sut, secretTokenCode } = makeSut()

    const jwtCalledWith = jest.spyOn(jwt, 'sign')

    await sut.generate({ payload: 'any_value' })

    expect(jwtCalledWith).toHaveBeenCalledWith({ payload: 'any_value' }, secretTokenCode, { expiresIn: 300 })
  })

  test('Should throw if jwt sign throw', async () => {
    const { sut } = makeSut()

    jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
      throw new Error()
    })

    const promise = sut.generate({ any_data: 'any' })

    await expect(promise).rejects.toThrow(new Error())
  })

  test('Should return an token if payload is provided', async () => {
    const { sut } = makeSut()

    const token = await sut.generate({ any_data: 'any_payload' })

    expect(token).toBe('any_token')
  })

  // test('Should return null if no decode token is provided', async () => {
  //   const { sut } = makeSut()

  //   const decodeToken = sut.decode('')

  //   expect(decodeToken).toBeNull()
  // })

  // test('Should return undefined if invalid token is provided', async () => {
  //   const { sut } = makeSut()

  //   jest.spyOn(jwt, 'verify').mockImplementationOnce(() => undefined)

  //   const decodeToken = sut.decode('invalid_token')

  //   expect(decodeToken).toBe(undefined)
  // })

  // test('Should return original payload if valid token is provided', async () => {
  //   const { sut } = makeSut()

  //   const payload = 'any_payload'

  //   jest.spyOn(jwt, 'verify').mockImplementationOnce(() => payload)
  //   const decodeToken = sut.decode('valid_token')

  //   expect(decodeToken).toBe(payload)
  // })
})
