import { describe, expect, test } from '@jest/globals';
import bcrypt from './__mocks__/bcrypt';
import EncrypterHelper from './encrypter'


const makeSut = () => {
  return new EncrypterHelper()
}

describe('EncrypterHelper', () => {
  test('Should returns null if no param is provided', async () => {
    const sut = makeSut()
    
    const result = sut.hash('')    
    
    expect(result).toBeNull()
  })
  test('Should calls bcrypt with correct params', async () => {
    const sut = makeSut()
    
    sut.hash('any_string')
    
    
    expect(bcrypt.hashParam).toBe('any_string')
  })

  test('Should string be different from the encrypted string', async () => {
    const sut = makeSut()
    
    const noHashString = 'any'
    const hashString = sut.hash(noHashString)

    expect(noHashString).not.toBe(hashString)
  })

  test('Should return null if invalid string are provided', async () => {
    const sut = makeSut()
    bcrypt.validHashString = false
    const hashString = await sut.compare('invalid_string', 'valid_hash')

    expect(hashString).toBe(false)
  })

  test('Should return true if valid string are provided', async () => {
    const sut = makeSut()
    bcrypt.validHashString = true
    const hashString = await sut.compare('valid_string', 'valid_hash')

    expect(hashString).toBe(true)
  })
})
