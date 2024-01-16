import { describe, expect, test } from '@jest/globals'
import { EncrypterHelper } from './encrypter'
import bcrypt from 'bcrypt'

const makeSut = () => {
  return new EncrypterHelper()
}

describe('EncrypterHelper', () => {
  test('Should calls bcrypt with correct params', async () => {
    const sut = makeSut()

    const receivedHashParam = jest.spyOn(bcrypt, 'hashSync')

    sut.hash('any_string')

    expect(receivedHashParam).toHaveBeenCalledWith('any_string', 10)
  })

  test('Should string be different from the encrypted string', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'hashSync').mockImplementationOnce(() => 'hash_str')

    const noHashString = 'no_hash_str'
    const hashedString = sut.hash(noHashString)

    expect(noHashString).not.toBe(hashedString)
  })

  test('Should return false if invalid string are provided', async () => {
    const sut = makeSut()

    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)

    const hashString = await sut.compare('invalid_string', 'valid_hash')

    expect(hashString).toBe(false)
  })

  test('Should return true if valid string are provided', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => true)

    const hashString = await sut.compare('valid_string', 'valid_hash')

    expect(hashString).toBe(true)
  })
})
